import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notifyDonorDonationStatus } from "@/lib/email";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session, "donations.manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const action = String(body.action || "");
    const comments = String(body.comments || "").trim();

    if (!["CONFIRMED", "REJECTED"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    if (comments.length < 5) {
      return NextResponse.json(
        { error: "Please add comments (at least 5 characters)" },
        { status: 400 },
      );
    }

    const donation = await prisma.donation.findUnique({ where: { id } });
    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }
    if (donation.status !== "PENDING") {
      return NextResponse.json(
        { error: "This donation was already reviewed" },
        { status: 409 },
      );
    }

    await prisma.$transaction([
      prisma.donation.update({
        where: { id },
        data: { status: action },
      }),
      prisma.donationReview.create({
        data: {
          donationId: id,
          reviewedById: session.id,
          action,
          comments,
        },
      }),
    ]);

    if (donation.email) {
      void notifyDonorDonationStatus({
        email: donation.email,
        referenceNo: donation.referenceNo,
        donorName: donation.donorName,
        action: action as "CONFIRMED" | "REJECTED",
        comments,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Decision failed" }, { status: 500 });
  }
}
