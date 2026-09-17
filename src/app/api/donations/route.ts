import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyAdminNewDonation } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  generateUniqueDonationReferenceNo,
  isDatabaseConfigured,
} from "@/lib/settings";
import { saveUploadedFile, UploadValidationError } from "@/lib/uploads";
import { donationNotifySchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }

    const ip = clientIp(request);
    const limited = rateLimit(`donate:${ip}`, 5, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${limited.retryAfterSec}s.` },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const raw = {
      donorName: String(formData.get("donorName") || ""),
      mobile: String(formData.get("mobile") || ""),
      email: String(formData.get("email") || ""),
      amount: formData.get("amount"),
      method: String(formData.get("method") || ""),
      transactionId: String(formData.get("transactionId") || ""),
      notes: String(formData.get("notes") || ""),
    };

    const parsed = donationNotifySchema.safeParse(raw);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid form data";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const proof = formData.get("proof");
    let proofUrl: string | null = null;
    if (proof instanceof File && proof.size > 0) {
      proofUrl = await saveUploadedFile(proof, "donation-proof");
    }

    const referenceNo = await generateUniqueDonationReferenceNo();

    const donation = await prisma.donation.create({
      data: {
        referenceNo,
        donorName: parsed.data.donorName,
        mobile: parsed.data.mobile,
        email: parsed.data.email || null,
        amount: parsed.data.amount,
        method: parsed.data.method,
        transactionId: parsed.data.transactionId || null,
        notes: parsed.data.notes || null,
        proofUrl,
        status: "PENDING",
      },
    });

    void notifyAdminNewDonation({
      referenceNo: donation.referenceNo,
      donorName: donation.donorName,
      amount: donation.amount,
      method: donation.method,
    });

    return NextResponse.json({
      ok: true,
      referenceNo: donation.referenceNo,
      id: donation.id,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message =
      error instanceof Error ? error.message : "Failed to submit donation report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
