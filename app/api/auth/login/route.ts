import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await compare(input.password, user.passwordHash)) || user.status !== "ACTIVE")
      return jsonError("Invalid email or password", 401);
    await createSession(user);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { return handleApiError(error); }
}
