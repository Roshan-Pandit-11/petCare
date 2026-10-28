import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const data = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      sitter: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data });
}
export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const body = (await request.json().catch(() => null)) as {
    sitterId?: string;
  } | null;
  if (!body?.sitterId) return jsonError("sitterId is required");
  const sitter = await prisma.sitterProfile.findUnique({
    where: { id: body.sitterId },
    select: { id: true },
  });
  if (!sitter) return jsonError("Sitter not found", 404);
  const data = await prisma.favorite.upsert({
    where: { userId_sitterId: { userId: user.id, sitterId: sitter.id } },
    create: { userId: user.id, sitterId: sitter.id },
    update: {},
  });
  return NextResponse.json({ data }, { status: 201 });
}
export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const sitterId = request.nextUrl.searchParams.get("sitterId");
  if (!sitterId) return jsonError("sitterId query parameter is required");
  await prisma.favorite.deleteMany({ where: { userId: user.id, sitterId } });
  return NextResponse.json({ ok: true });
}
