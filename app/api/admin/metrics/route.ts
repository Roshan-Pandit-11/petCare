import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return jsonError("Authentication required", 401);
    }

    if (user.role !== "ADMIN") {
      return jsonError("Admin role required", 403);
    }

    const [
      totalUsers,
      activeSitters,
      pendingVerifications,
      bookingGroups,
      openReports,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.sitterProfile.count({
        where: {
          isAvailable: true,
        },
      }),

      prisma.verification.count({
        where: {
          status: {
            in: ["SUBMITTED", "PENDING"],
          },
        },
      }),

      prisma.booking.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),

      prisma.report.count({
        where: {
          status: {
            in: ["OPEN", "UNDER_REVIEW"],
          },
        },
      }),
    ]);

    const bookings = Object.fromEntries(
      bookingGroups.map((group) => [group.status, group._count._all]),
    );

    return NextResponse.json({
      data: {
        totalUsers,
        activeSitters,
        pendingVerifications,
        openReports,
        bookings,
      },
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
