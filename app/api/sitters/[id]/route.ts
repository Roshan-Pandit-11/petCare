import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const sitter = await prisma.sitterProfile.findFirst({
    where: { OR: [{ id }, { userId: id }] },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          bio: true,
          createdAt: true,
        },
      },
      reviews: {
        where: { demoRecord: false },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { author: { select: { name: true, avatarUrl: true } } },
      },
    },
  });
  if (!sitter) return jsonError("Sitter not found", 404);
  return NextResponse.json({ data: sitter });
}
