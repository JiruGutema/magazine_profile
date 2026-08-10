import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { rateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/reaction-security";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 6; // 6 hrs

/**
 * Login throttles are per-IP and sized for a human typing a password, not for
 * a script. Deliberately not keyed on the submitted email: that would let an
 * attacker lock the admin out of their own account.
 */
const BURST_LIMIT = 5;
const BURST_WINDOW_MS = 60 * 1000;
const SUSTAINED_LIMIT = 20;
const SUSTAINED_WINDOW_MS = 15 * 60 * 1000;

function tooManyAttempts(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: "Too many login attempts. Please try again later.",
      retryAfter: retryAfterSeconds,
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    },
  );
}

export async function POST(request: NextRequest) {
  try {
    // Throttle before touching the database or bcrypt — an unthrottled bcrypt
    // comparison is itself a CPU-exhaustion vector.
    const ip = getClientIp(request);

    const burstCheck = rateLimiter.check(
      "admin_login_burst",
      ip,
      BURST_LIMIT,
      BURST_WINDOW_MS,
    );
    if (!burstCheck.allowed) {
      return tooManyAttempts(burstCheck.retryAfterSeconds);
    }

    const sustainedCheck = rateLimiter.check(
      "admin_login_sustained",
      ip,
      SUSTAINED_LIMIT,
      SUSTAINED_WINDOW_MS,
    );
    if (!sustainedCheck.allowed) {
      return tooManyAttempts(sustainedCheck.retryAfterSeconds);
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    const cookieStore = await cookies();
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
