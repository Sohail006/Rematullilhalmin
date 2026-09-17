import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DONATION_METHODS, DONATION_STATUSES } from "@/lib/constants";

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
    if (!session || !hasPermission(session, "donations.view")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const method = searchParams.get("method");
    const q = searchParams.get("q")?.trim() || "";

    const donations = await prisma.donation.findMany({
      where: {
        ...(status &&
        DONATION_STATUSES.includes(status as (typeof DONATION_STATUSES)[number])
          ? { status }
          : {}),
        ...(method &&
        DONATION_METHODS.includes(method as (typeof DONATION_METHODS)[number])
          ? { method }
          : {}),
        ...(q
          ? {
              OR: [
                { referenceNo: { contains: q, mode: "insensitive" } },
                { donorName: { contains: q, mode: "insensitive" } },
                { mobile: { contains: q } },
                { email: { contains: q, mode: "insensitive" } },
                { transactionId: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Reference",
      "Status",
      "Donor",
      "Mobile",
      "Email",
      "Method",
      "Amount PKR",
      "Transaction ID",
      "Proof URL",
      "Notes",
      "Submitted",
    ];

    const rows = donations.map((donation) =>
      [
        donation.referenceNo,
        donation.status,
        donation.donorName,
        donation.mobile,
        donation.email,
        donation.method,
        donation.amount,
        donation.transactionId,
        donation.proofUrl,
        donation.notes,
        donation.createdAt.toISOString(),
      ]
        .map(csvEscape)
        .join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const suffix = [status || "all", method || "all", q ? "filtered" : ""]
      .filter(Boolean)
      .join("-");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="donations-${suffix}.csv"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
