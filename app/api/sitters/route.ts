import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePositiveInt } from "@/lib/api";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get("q")?.trim();
  const city = params.get("city")?.trim();
  const species = params.get("species");
  const minRate = Number(params.get("minRate") ?? 0);
  const maxRate = Number(params.get("maxRate") ?? 100000);
  const page = parsePositiveInt(params.get("page"), 1, 10000);
  const limit = parsePositiveInt(params.get("limit"), 12, 50);
  const where = {
    isAvailable: true,
    dailyRate: {
      gte: Number.isFinite(minRate) ? minRate : 0,
      lte: Number.isFinite(maxRate) ? maxRate : 100000,
    },
    ...(city ? { city: { contains: city, mode: "insensitive" as const } } : {}),
    ...(species && ["DOG", "CAT", "BIRD", "RABBIT", "OTHER"].includes(species)
      ? {
          acceptedSpecies: {
            has: species as "DOG" | "CAT" | "BIRD" | "RABBIT" | "OTHER",
          },
        }
      : {}),
    ...(q
      ? {
          OR: [
            { user: { name: { contains: q, mode: "insensitive" as const } } },
            { city: { contains: q, mode: "insensitive" as const } },
            { locality: { contains: q, mode: "insensitive" as const } },
            { about: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
  const [data, total] = await prisma.$transaction([
    prisma.sitterProfile.findMany({
      where,
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: [{ averageRating: "desc" }, { dailyRate: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.sitterProfile.count({ where }),
  ]);
  return NextResponse.json({
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
