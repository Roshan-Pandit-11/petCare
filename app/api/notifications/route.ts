import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const data = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({
    data,
    unreadCount: data.filter((item) => !item.readAt).length,
  });
}
export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) return jsonError("Authentication required", 401);
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    all?: boolean;
  } | null;
  if (body?.all) {
    await prisma.notification.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
  } else if (body?.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, userId: user.id },
      data: { readAt: new Date() },
    });
  } else return jsonError("Provide notification id or all=true");
  return NextResponse.json({ ok: true });
}
