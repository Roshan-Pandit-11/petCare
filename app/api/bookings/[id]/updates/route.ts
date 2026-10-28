import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  type: z
    .enum([
      "CHECK_IN",
      "FOOD",
      "WALK",
      "MEDICATION",
      "PHOTO",
      "NOTE",
      "CHECK_OUT",
    ])
    .default("NOTE"),
  message: z.string().trim().min(1).max(2000),
  foodLog: z.string().max(1000).optional(),
  activityLog: z.string().max(1000).optional(),
  medicationLog: z.string().max(1000).optional(),
  photoUrl: z.url().optional(),
});
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const { id } = await context.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { sitter: true },
  });
  if (!booking) return jsonError("Booking not found", 404);
  if (
    user.role !== "ADMIN" &&
    booking.ownerId !== user.id &&
    booking.sitter.userId !== user.id
  )
    return jsonError("Forbidden", 403);
  return NextResponse.json({
    data: await prisma.stayUpdate.findMany({
      where: { bookingId: id },
      orderBy: { createdAt: "desc" },
    }),
  });
}
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const { id } = await context.params;
  try {
    const input = updateSchema.parse(await request.json());
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { sitter: true },
    });
    if (!booking) return jsonError("Booking not found", 404);
    if (booking.sitter.userId !== user.id && user.role !== "ADMIN")
      return jsonError("Only the assigned sitter can post stay updates", 403);
    if (!["CHECKED_IN", "ACTIVE"].includes(booking.status))
      return jsonError("Stay updates are available after check-in", 409);
    const data = await prisma.stayUpdate.create({
      data: { ...input, bookingId: id, authorId: user.id },
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
