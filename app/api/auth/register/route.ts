import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { registerSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Validate input using your existing schema
    const result = registerSchema.safeParse(body);

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

    // Check whether the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Hash the password
    const passwordHash = await hash(input.password, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Create the login session
    await createSession(user);

    return NextResponse.json(
      {
        message: "Registration successful",
        user,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    // Handle duplicate email errors from Prisma
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
