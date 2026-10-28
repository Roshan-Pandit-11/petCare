import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const input = registerSchema.parse(await request.json());
    const existing = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } });
    if (existing) return jsonError("An account with this email already exists", 409);
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash: await hash(input.password, 12), role: input.role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    await createSession(user);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
