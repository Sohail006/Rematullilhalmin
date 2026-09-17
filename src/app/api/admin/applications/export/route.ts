import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDateTimePK } from "@/lib/datetime";
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
    const q = searchParams.get("q")?.trim() || "";

    const applications = await prisma.application.findMany({
      where: {
        ...(status &&
        APPLICATION_STATUSES.includes(
          status as (typeof APPLICATION_STATUSES)[number],
        )
          ? { status }
          : {}),
        ...(q
          ? {
              OR: [
                { referenceNo: { contains: q, mode: "insensitive" } },
                { fullName: { contains: q, mode: "insensitive" } },
                { guardianName: { contains: q, mode: "insensitive" } },
                { cnic: { contains: q.replace(/[-\s]/g, "") } },
                { mobile: { contains: q.replace(/\D/g, "") || q } },
                { schoolName: { contains: q, mode: "insensitive" } },
                { city: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        decisions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { decidedBy: { select: { fullName: true } } },
        },
      },
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
      "Address",
      "School",
      "School address",
      "Class",
      "Previous marks",
      "Fee PKR",
      "Income info",
      "Disability",
      "Fee challan URL",
      "B-Form URL",
      "Income cert URL",
      "Latest decision",
      "Decision comments",
      "Decided by",
      "Submitted",
    ];

    const rows = applications.map((app) => {
      const latest = app.decisions[0];
      return [
        app.referenceNo,
        app.status,
        app.fullName,
        app.guardianName,
        app.cnic,
        app.mobile,
        app.email,
        app.city,
        app.address,
        app.schoolName,
        app.schoolAddress,
        app.classGrade,
        app.previousMarks,
        app.feeAmount,
        app.incomeInfo,
        app.hasDisability ? app.disabilityInfo || "Yes" : "No",
        app.feeChallanUrl,
        app.bFormUrl,
        app.incomeCertUrl,
        latest?.action || "",
        latest?.comments || "",
        latest?.decidedBy.fullName || "",
        formatDateTimePK(app.createdAt),
      ]
        .map(csvEscape)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const suffix = [status || "all", q ? "filtered" : ""].filter(Boolean).join("-");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="applications-${suffix}.csv"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
