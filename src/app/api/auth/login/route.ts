import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  createSessionToken,
  loadUserSession,
  setSessionCookie,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`login:${ip}`, 8, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${limited.retryAfterSec}s.` },
        { status: 429 },
      );
    }

    const body = await request.json();
    const username = String(body.username || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    const sessionUser = await loadUserSession(user.id);
    if (!sessionUser) {
      return NextResponse.json({ error: "Account inactive" }, { status: 401 });
    }

    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json({ ok: true, user: sessionUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
