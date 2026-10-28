import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const status = request.nextUrl.searchParams.get("status");
  const validStatuses = ["PENDING","ACCEPTED","REJECTED","PAYMENT_PENDING","CONFIRMED","CHECKED_IN","ACTIVE","COMPLETED","CANCELLED"];
  const statusFilter = status && validStatuses.includes(status) ? { status: status as typeof validStatuses[number] } : {};
  const where = user.role === "ADMIN" ? statusFilter : user.role === "SITTER"
    ? { ...statusFilter, sitter: { userId: user.id } }
    : { ...statusFilter, ownerId: user.id };
  const data = await prisma.booking.findMany({
    where, include: { pet: true, owner: { select: { id: true, name: true, avatarUrl: true } },
      sitter: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
      payment: true, stayUpdates: { orderBy: { createdAt: "desc" }, take: 5 } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  if (user.role !== "OWNER") return jsonError("Only owners can request bookings", 403);
  try {
    const input = bookingSchema.parse(await request.json());
    const checkIn = new Date(input.checkIn);
    const checkOut = new Date(input.checkOut);
    if (checkOut <= checkIn) return jsonError("Check-out must be after check-in", 422);
    if (checkIn < new Date(new Date().setHours(0,0,0,0))) return jsonError("Check-in cannot be in the past", 422);
    const [pet, sitter] = await Promise.all([
      prisma.pet.findFirst({ where: { id: input.petId, ownerId: user.id } }),
      prisma.sitterProfile.findUnique({ where: { id: input.sitterId } }),
    ]);
    if (!pet) return jsonError("Pet not found for this owner", 404);
    if (!sitter || !sitter.isAvailable) return jsonError("Sitter is not available", 409);
    if (!sitter.acceptedSpecies.includes(pet.species)) return jsonError("This sitter does not accept this pet species", 422);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000);
    if (nights < 1 || nights > 90) return jsonError("Stay must be between 1 and 90 nights", 422);
    const conflict = await prisma.booking.findFirst({
      where: { sitterId: sitter.id, status: { in: ["ACCEPTED","PAYMENT_PENDING","CONFIRMED","CHECKED_IN","ACTIVE"] },
        checkIn: { lt: checkOut }, checkOut: { gt: checkIn } },
      select: { id: true },
    });
    if (conflict) return jsonError("Sitter already has a booking during those dates", 409);
    const subtotal = nights * sitter.dailyRate;
    const platformFee = Math.round(subtotal * 0.08);
    const booking = await prisma.booking.create({
      data: { ownerId: user.id, sitterId: sitter.id, petId: pet.id, checkIn, checkOut, nights,
        dailyRate: sitter.dailyRate, subtotal, platformFee, total: subtotal + platformFee,
        specialInstructions: input.specialInstructions, status: "PENDING" },
      include: { pet: true, sitter: { include: { user: { select: { id: true, name: true } } } } },
    });
    return NextResponse.json({ data: booking, pricing: { nights, subtotal, platformFee, total: subtotal + platformFee, currency: "INR" } }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
