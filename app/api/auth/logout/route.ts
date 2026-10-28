import { NextResponse } from "next/server";

import { destroySession } from "@/lib/auth";
import { handleApiError } from "@/lib/api";

// export const runtime = "nodejs";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
