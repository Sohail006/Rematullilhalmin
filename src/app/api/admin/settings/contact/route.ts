import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { setSetting } from "@/lib/settings";
import type { ContactSettings } from "@/lib/constants";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session, "settings.contact")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as ContactSettings;
    await setSetting("contact", {
      phone: String(body.phone || ""),
      whatsapp: String(body.whatsapp || ""),
      email: String(body.email || ""),
      address: String(body.address || ""),
      officeHours: String(body.officeHours || ""),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
