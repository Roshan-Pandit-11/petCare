import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { petSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const { id } = await context.params;
  const pet = await prisma.pet.findFirst({ where: { id, ownerId: user.id } });
  if (!pet) return jsonError("Pet not found", 404);
  return NextResponse.json({ data: pet });
}
export async function PATCH(request: NextRequest, context: Context) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const { id } = await context.params;
  try {
    const input = petSchema.partial().parse(await request.json());
    const existing = await prisma.pet.findFirst({
      where: { id, ownerId: user.id },
      select: { id: true },
    });
    if (!existing) return jsonError("Pet not found", 404);
    return NextResponse.json({
      data: await prisma.pet.update({ where: { id }, data: input }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
export async function DELETE(_request: NextRequest, context: Context) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const { id } = await context.params;
  const existing = await prisma.pet.findFirst({
    where: { id, ownerId: user.id },
    select: { id: true },
  });
  if (!existing) return jsonError("Pet not found", 404);
  await prisma.pet.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
