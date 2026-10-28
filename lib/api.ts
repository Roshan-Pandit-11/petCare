import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status },
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError(
      "Validation failed",
      422,
      error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code);
    if (code === "P2002")
      return jsonError("A record with this value already exists", 409);
    if (code === "P2025") return jsonError("Record not found", 404);
    if (code === "P2003")
      return jsonError("Related record does not exist", 400);
  }
  console.error("API error:", error);
  return jsonError("An unexpected server error occurred", 500);
}

export function parsePositiveInt(
  value: string | null,
  fallback: number,
  max = 100,
) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}
