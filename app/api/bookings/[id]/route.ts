import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };
export async function GET(_request: NextRequest, context: Context) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const { id } = await context.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      pet: true,
      owner: { select: { id: true, name: true, email: true } },
      sitter: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      payment: true,
      stayUpdates: { orderBy: { createdAt: "desc" } },
      reviews: true,
    },
  });
  if (!booking) return jsonError("Booking not found", 404);
  const allowed =
    user.role === "ADMIN" ||
    booking.ownerId === user.id ||
    booking.sitter.userId === user.id;
  if (!allowed) return jsonError("Forbidden", 403);
  return NextResponse.json({ data: booking });
}
export async function PATCH(request: NextRequest, context: Context) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    status?: string;
    cancellationReason?: string;
  } | null;
  if (!body?.status) return jsonError("A status is required");
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { sitter: true },
  });
  if (!booking) return jsonError("Booking not found", 404);
  const isOwner = booking.ownerId === user.id;
  const isSitter = booking.sitter.userId === user.id;
  const isAdmin = user.role === "ADMIN";
  const transitions: Record<string, string[]> = {
    PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
    ACCEPTED: ["PAYMENT_PENDING", "CANCELLED"],
    PAYMENT_PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CHECKED_IN", "CANCELLED"],
    CHECKED_IN: ["ACTIVE"],
    ACTIVE: ["COMPLETED"],
  };
  const target = body.status;
  const sitterOnly = [
    "ACCEPTED",
    "REJECTED",
    "CHECKED_IN",
    "ACTIVE",
    "COMPLETED",
  ];
  const ownerOnly = ["PAYMENT_PENDING", "CANCELLED"];
  if (!isAdmin && !isOwner && !isSitter) return jsonError("Forbidden", 403);
  if (
    !isAdmin &&
    ((sitterOnly.includes(target) && !isSitter) ||
      (ownerOnly.includes(target) && !isOwner))
  )
    return jsonError("You cannot perform this status transition", 403);
  if (!isAdmin && !(transitions[booking.status] ?? []).includes(target))
    return jsonError(
      `Cannot transition from ${booking.status} to ${target}`,
      409,
    );
  if (!Object.keys(transitions).includes(booking.status) && !isAdmin)
    return jsonError("Booking is not editable", 409);
  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: target as never,
      ...(target === "ACCEPTED" ? { acceptedAt: new Date() } : {}),
      ...(target === "CHECKED_IN" ? { checkedInAt: new Date() } : {}),
      ...(target === "COMPLETED" ? { completedAt: new Date() } : {}),
      ...(target === "CANCELLED" || target === "REJECTED"
        ? { cancellationReason: body.cancellationReason?.slice(0, 1000) }
        : {}),
    },
  });
  return NextResponse.json({ data: updated });
}
