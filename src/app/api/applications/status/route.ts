import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/settings";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { cnicSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 },
      );
    }

    const ip = clientIp(request);
    const limited = rateLimit(`status:${ip}`, 15, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${limited.retryAfterSec}s.` },
        { status: 429 },
      );
    }

    const body = await request.json();
    const referenceNo = String(body.referenceNo || "").trim().toUpperCase();
    const cnicRaw = String(body.cnic || "").trim();

    if (!referenceNo) {
      return NextResponse.json(
        { error: "Reference number is required" },
        { status: 400 },
      );
    }

    const cnicResult = cnicSchema.safeParse(cnicRaw);
    if (!cnicResult.success) {
      return NextResponse.json(
        { error: cnicResult.error.issues[0]?.message || "Invalid CNIC" },
        { status: 400 },
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        referenceNo,
        cnic: cnicResult.data,
      },
      include: {
        decisions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "No application found with this reference and CNIC" },
        { status: 404 },
      );
    }

    const latestDecision = application.decisions[0];

    return NextResponse.json({
      referenceNo: application.referenceNo,
      fullName: application.fullName,
      status: application.status,
      submittedAt: application.createdAt,
      schoolName: application.schoolName,
      feeAmount: application.feeAmount,
      decision: latestDecision
        ? {
            action: latestDecision.action,
            comments: latestDecision.comments,
            decidedAt: latestDecision.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
