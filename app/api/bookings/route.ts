import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";


const validStatuses = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
] as const;

const blockingStatuses = [
  "PENDING",
  "ACCEPTED",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "ACTIVE",
] as const;

function isErrorWithCode(
  error: unknown,
  code: string
): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
}

// GET /api/bookings
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return jsonError("Authentication required", 401);
    }

    if (user.status !== "ACTIVE") {
      return jsonError("Account is not active", 403);
    }

    const status = request.nextUrl.searchParams.get("status");

    if (
      status &&
      !validStatuses.includes(
        status as (typeof validStatuses)[number]
      )
    ) {
      return jsonError("Invalid booking status", 400);
    }

    const statusFilter = status
      ? { status: status as (typeof validStatuses)[number] }
      : {};

    let where;

    if (user.role === "ADMIN") {
      where = { ...statusFilter };
    } else if (user.role === "SITTER") {
      where = {
        ...statusFilter,
        sitter: {
          userId: user.id,
        },
      };
    } else {
      where = {
        ...statusFilter,
        ownerId: user.id,
      };
    }

    const data = await prisma.booking.findMany({
      where,
      include: {
        pet: true,

        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },

        sitter: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },

        payment: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            provider: true,
            paidAt: true,
            createdAt: true,
          },
        },

        stayUpdates: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },

      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

// POST /api/bookings
export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return jsonError("Authentication required", 401);
    }

    if (user.status !== "ACTIVE") {
      return jsonError("Account is not active", 403);
    }

    if (user.role !== "OWNER") {
      return jsonError("Only owners can request bookings", 403);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const input = result.data;
    const checkIn = new Date(input.checkIn);
    const checkOut = new Date(input.checkOut);

    if (
      !Number.isFinite(checkIn.getTime()) ||
      !Number.isFinite(checkOut.getTime())
    ) {
      return jsonError("Invalid booking dates", 400);
    }

    if (checkOut <= checkIn) {
      return jsonError(
        "Check-out must be after check-in",
        422
      );
    }

    const today = startOfUtcDay(new Date());

    if (checkIn < today) {
      return jsonError(
        "Check-in cannot be in the past",
        422
      );
    }

    // Calculate nights using calendar days in UTC.
    const firstNight = startOfUtcDay(checkIn);
    const checkoutDay = startOfUtcDay(checkOut);

    const nights = Math.round(
      (checkoutDay.getTime() - firstNight.getTime()) /
        86_400_000
    );

    if (nights < 1 || nights > 90) {
      return jsonError(
        "Stay must be between 1 and 90 nights",
        422
      );
    }

    const [pet, sitter] = await Promise.all([
      prisma.pet.findFirst({
        where: {
          id: input.petId,
          ownerId: user.id,
        },
        select: {
          id: true,
          species: true,
        },
      }),

      prisma.sitterProfile.findUnique({
        where: {
          id: input.sitterId,
        },
        include: {
          user: {
            select: {
              status: true,
            },
          },
        },
      }),
    ]);

    if (!pet) {
      return jsonError(
        "Pet not found for this owner",
        404
      );
    }

    if (
      !sitter ||
      !sitter.isAvailable ||
      sitter.user.status !== "ACTIVE"
    ) {
      return jsonError(
        "Sitter is not available",
        409
      );
    }

    // PetCare trust requirement: only fully verified sitters
    // can receive booking requests.
    if (
      sitter.identityStatus !== "APPROVED" ||
      sitter.addressStatus !== "APPROVED" ||
      sitter.homeStatus !== "APPROVED"
    ) {
      return jsonError(
        "Sitter verification is not complete",
        409
      );
    }

    if (!sitter.acceptedSpecies.includes(pet.species)) {
      return jsonError(
        "This sitter does not accept this pet species",
        422
      );
    }

    // Availability records represent calendar dates.
    // A missing record is treated as not explicitly blocked.
    const unavailableDates = await prisma.availability.findFirst({
      where: {
        sitterId: sitter.id,
        isAvailable: false,
        date: {
          gte: firstNight,
          lt: checkoutDay,
        },
      },
      select: {
        id: true,
      },
    });

    if (unavailableDates) {
      return jsonError(
        "Sitter is unavailable for one or more selected dates",
        409
      );
    }

    const subtotal = nights * sitter.dailyRate;

    // Existing PetCare pricing rule: 8% platform fee.
    const platformFee = Math.round(subtotal * 0.08);
    const total = subtotal + platformFee;

    // Check overlap and create the booking in one transaction.
    // Serializable isolation helps prevent concurrent requests
    // from both reserving the same sitter capacity.
    const booking = await prisma.$transaction(
      async (tx) => {
        const overlappingBookings =
          await tx.booking.count({
            where: {
              sitterId: sitter.id,
              status: {
                in: [...blockingStatuses],
              },
              checkIn: {
                lt: checkOut,
              },
              checkOut: {
                gt: checkIn,
              },
            },
          });

        if (overlappingBookings >= sitter.maxPets) {
          throw new Error("SITTER_CAPACITY_CONFLICT");
        }

        return tx.booking.create({
          data: {
            ownerId: user.id,
            sitterId: sitter.id,
            petId: pet.id,

            checkIn,
            checkOut,
            nights,

            dailyRate: sitter.dailyRate,
            subtotal,
            platformFee,
            total,
            currency: sitter.currency,

            specialInstructions:
              input.specialInstructions,

            status: "PENDING",
          },

          include: {
            pet: true,

            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },

            sitter: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        });
      },
      {
        isolationLevel: "Serializable",
      }
    );

    return NextResponse.json(
      {
        message: "Booking request created successfully",
        data: booking,
        pricing: {
          nights,
          dailyRate: sitter.dailyRate,
          subtotal,
          platformFee,
          total,
          currency: sitter.currency,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "SITTER_CAPACITY_CONFLICT"
    ) {
      return jsonError(
        "Sitter has no remaining capacity for those dates",
        409
      );
    }

    // PostgreSQL serialization conflict; retrying the request
    // may succeed if the competing booking does not remain.
    if (isErrorWithCode(error, "P2034")) {
      return jsonError(
        "Booking availability changed. Please try again",
        409
      );
    }

    return handleApiError(error);
  }
}