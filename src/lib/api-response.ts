import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/core/errors/app.error";

export function ok<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
  }
  if (error instanceof ZodError) {
    const message = error.errors[0]?.message ?? "Invalid input.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { success: false, error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}
