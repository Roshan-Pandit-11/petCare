import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { loginSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const input = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    // Use the same response for missing users and incorrect passwords.
    if (!user) {
      return jsonError("Invalid email or password", 401);
    }

    const passwordMatches = await compare(input.password, user.passwordHash);

    if (!passwordMatches || user.status !== "ACTIVE") {
      return jsonError("Invalid email or password", 401);
    }

    await createSession(user);

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
