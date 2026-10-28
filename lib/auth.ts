import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "petcare_session";
const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32)
    throw new Error("AUTH_SECRET must be set to at least 32 characters");
  return new TextEncoder().encode(value);
};

export async function createSession(user: { id: string; role: string }) {
  const token = await new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || typeof payload.role !== "string") return null;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    if (!user || user.status !== "ACTIVE") return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const user = await getSession();
  if (!user)
    return {
      user: null,
      response: Response.json(
        { error: "Authentication required" },
        { status: 401 },
      ),
    };
  return { user, response: null };
}
