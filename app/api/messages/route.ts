import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const bookingId = request.nextUrl.searchParams.get("bookingId");
  const where =
    user.role === "ADMIN"
      ? {}
      : {
          booking: {
            OR: [{ ownerId: user.id }, { sitter: { userId: user.id } }],
          },
        };
  const conversations = await prisma.conversation.findMany({
    where: { ...where, ...(bookingId ? { bookingId } : {}) },
    include: {
      booking: {
        include: {
          pet: true,
          owner: { select: { id: true, name: true } },
          sitter: { include: { user: { select: { id: true, name: true } } } },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 100,
        include: { sender: { select: { id: true, name: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ data: conversations });
}
export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const body = (await request.json().catch(() => null)) as {
    bookingId?: string;
    body?: string;
  } | null;
  if (!body?.bookingId || !body.body?.trim() || body.body.length > 2000)
    return jsonError("bookingId and message body are required");
  const booking = await prisma.booking.findUnique({
    where: { id: body.bookingId },
    include: { sitter: true },
  });
  if (!booking) return jsonError("Booking not found", 404);
  if (
    user.role !== "ADMIN" &&
    booking.ownerId !== user.id &&
    booking.sitter.userId !== user.id
  )
    return jsonError("Forbidden", 403);
  const conversation = await prisma.conversation.upsert({
    where: { bookingId: booking.id },
    create: { bookingId: booking.id },
    update: {},
  });
  const message = await prisma.$transaction(async (tx) => {
    const created = await tx.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        body: body.body!.trim(),
      },
      include: { sender: { select: { id: true, name: true } } },
    });
    await tx.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });
    const recipientId =
      booking.ownerId === user.id ? booking.sitter.userId : booking.ownerId;
    await tx.notification.create({
      data: {
        userId: recipientId,
        type: "MESSAGE",
        title: "New booking message",
        body: "You have a new message about a booking.",
        href: "/owner/messages",
      },
    });
    return created;
  });
  return NextResponse.json({ data: message }, { status: 201 });
}
