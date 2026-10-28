import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { petSchema } from "@/lib/validation";

export async function GET() {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const pets = await prisma.pet.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: pets });
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  if (user.role !== "OWNER")
    return jsonError("Only pet owners can create pet profiles", 403);
  try {
    const input = petSchema.parse(await request.json());
    const pet = await prisma.pet.create({
      data: { ...input, ownerId: user.id },
    });
    return NextResponse.json({ data: pet }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
