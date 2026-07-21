import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session, "roles.manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    if (name.length < 2) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    const existing = await prisma.role.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "Role already exists" }, { status: 400 });
    }

    const role = await prisma.role.create({
      data: { name, description: "", isSystem: false },
    });

    return NextResponse.json({ ok: true, id: role.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}
