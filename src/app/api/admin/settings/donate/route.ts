import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { setSetting } from "@/lib/settings";
import type { DonateSettings } from "@/lib/constants";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session, "settings.donate")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as DonateSettings;
    await setSetting("donate", body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
