import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session, "roles.manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const permissionIds = Array.isArray(body.permissionIds)
      ? (body.permissionIds as string[])
      : [];

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    if (role.name === "Admin" && role.isSystem) {
      const all = await prisma.permission.findMany();
      await prisma.rolePermission.deleteMany({ where: { roleId: id } });
      await prisma.rolePermission.createMany({
        data: all.map((p) => ({ roleId: id, permissionId: p.id })),
      });
      return NextResponse.json({ ok: true });
    }

    const valid = await prisma.permission.findMany({
      where: { id: { in: permissionIds } },
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: id } });
    if (valid.length > 0) {
      await prisma.rolePermission.createMany({
        data: valid.map((p) => ({ roleId: id, permissionId: p.id })),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
