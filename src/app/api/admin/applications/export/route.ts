import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

function csvEscape(value: string | number | boolean | null | undefined) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session, "applications.view")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const applications = await prisma.application.findMany({
      where:
        status && ["PENDING", "APPROVED", "REJECTED"].includes(status)
          ? { status }
          : undefined,
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Reference",
      "Status",
      "Student",
      "Guardian",
      "CNIC",
      "Mobile",
      "Email",
      "City",
      "School",
      "Class",
      "Fee PKR",
      "Submitted",
    ];

    const rows = applications.map((app) =>
      [
        app.referenceNo,
        app.status,
        app.fullName,
        app.guardianName,
        app.cnic,
        app.mobile,
        app.email,
        app.city,
        app.schoolName,
        app.classGrade,
        app.feeAmount,
        app.createdAt.toISOString(),
      ]
        .map(csvEscape)
        .join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="applications-${status || "all"}.csv"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
