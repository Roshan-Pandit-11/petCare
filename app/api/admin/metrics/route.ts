import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  if (user.role !== "ADMIN") return jsonError("Admin role required", 403);
  const [users, sitters, pendingVerifications, bookings, reports] = await Promise.all([
    prisma.user.count(), prisma.sitterProfile.count({ where: { isAvailable: true } }),
    prisma.verification.count({ where: { status: { in: ["SUBMITTED","PENDING"] } } }),
    prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.report.count({ where: { status: { in: ["OPEN","UNDER_REVIEW"] } } }),
  ]);
  return NextResponse.json({ data: { users, activeSitters: sitters, pendingVerifications, openReports: reports,
    bookings: Object.fromEntries(bookings.map((item) => [item.status, item._count._all])) } });
}
