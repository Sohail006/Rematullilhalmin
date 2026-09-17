import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { isDatabaseConfigured } from "@/lib/settings";
import { mobileSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 },
      );
    }

    const ip = clientIp(request);
    const limited = rateLimit(`donation-status:${ip}`, 15, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${limited.retryAfterSec}s.` },
        { status: 429 },
      );
    }

    const body = await request.json();
    const referenceNo = String(body.referenceNo || "").trim().toUpperCase();
    const mobileRaw = String(body.mobile || "").trim();

    if (!referenceNo) {
      return NextResponse.json(
        { error: "Reference number is required" },
        { status: 400 },
      );
    }

    const mobileResult = mobileSchema.safeParse(mobileRaw);
    if (!mobileResult.success) {
      return NextResponse.json(
        { error: mobileResult.error.issues[0]?.message || "Invalid mobile" },
        { status: 400 },
      );
    }

    const donation = await prisma.donation.findFirst({
      where: {
        referenceNo,
        mobile: mobileResult.data,
      },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!donation) {
      return NextResponse.json(
        { error: "No donation found with this reference and mobile number" },
        { status: 404 },
      );
    }

    const latestReview = donation.reviews[0];

    return NextResponse.json({
      type: "donation",
      referenceNo: donation.referenceNo,
      donorName: donation.donorName,
      status: donation.status,
      submittedAt: donation.createdAt,
      amount: donation.amount,
      method: donation.method,
      decision: latestReview
        ? {
            action: latestReview.action,
            comments: latestReview.comments,
            decidedAt: latestReview.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
