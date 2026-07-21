import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session, "users.manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const username = String(body.username || "")
      .trim()
      .toLowerCase();
    const fullName = String(body.fullName || "").trim();
    const password = String(body.password || "");
    const roleId = String(body.roleId || "");

    if (username.length < 3 || fullName.length < 3 || password.length < 6) {
      return NextResponse.json(
        { error: "Invalid username, name, or password" },
        { status: 400 },
      );
    }

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, fullName, passwordHash, roleId },
    });

    return NextResponse.json({ ok: true, id: user.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
