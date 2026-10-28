import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

// export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
