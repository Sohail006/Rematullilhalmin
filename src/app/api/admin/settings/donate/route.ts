import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { setSetting } from "@/lib/settings";
import { donateSettingsSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session, "settings.donate")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = donateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid settings" },
        { status: 400 },
      );
    }

    await setSetting("donate", parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
