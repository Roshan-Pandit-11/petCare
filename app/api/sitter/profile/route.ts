import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { sitterProfileSchema } from "@/lib/validation";

export async function GET() {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const profile = await prisma.sitterProfile.findUnique({
    where: { userId: user.id },
  });
  return NextResponse.json({ data: profile });
}
export async function PUT(request: NextRequest) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  if (user.role !== "SITTER")
    return jsonError("Only sitter accounts can edit sitter profiles", 403);
  try {
    const input = sitterProfileSchema.parse(await request.json());
    const profile = await prisma.sitterProfile.upsert({
      where: { userId: user.id },
      create: { ...input, userId: user.id },
      update: input,
    });
    return NextResponse.json({ data: profile });
  } catch (error) {
    return handleApiError(error);
  }
}
