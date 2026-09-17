import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  notifyAdminNewDonation,
  notifyDonorDonationReceived,
} from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  generateUniqueDonationReferenceNo,
  getDonateSettings,
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
    const hasProof = proof instanceof File && proof.size > 0;
    const hasTxn = Boolean(parsed.data.transactionId);

    if (!hasProof && !hasTxn) {
      return NextResponse.json(
        {
          error:
            "Add a transaction / reference ID or upload payment proof so the board can verify your gift.",
        },
        { status: 400 },
      );
    }

    const donate = await getDonateSettings();
    const methodAllowed =
      (parsed.data.method === "BANK" &&
        donate.bank.enabled &&
        Boolean(donate.bank.accountNumber || donate.bank.iban)) ||
      (parsed.data.method === "JAZZCASH" &&
        donate.jazzcash.enabled &&
        Boolean(donate.jazzcash.mobileNumber)) ||
      (parsed.data.method === "EASYPAISA" &&
        donate.easypaisa.enabled &&
        Boolean(donate.easypaisa.mobileNumber));

    if (!methodAllowed) {
      return NextResponse.json(
        {
          error:
            "That payment method is not available right now. Choose another method or contact the foundation.",
        },
        { status: 400 },
      );
    }

    if (hasTxn) {
      const duplicateTxn = await prisma.donation.findFirst({
        where: {
          transactionId: {
            equals: parsed.data.transactionId,
            mode: "insensitive",
          },
        },
        select: { referenceNo: true },
      });
      if (duplicateTxn) {
        return NextResponse.json(
          {
            error: `This transaction ID was already reported (${duplicateTxn.referenceNo}).`,
          },
          { status: 409 },
        );
      }
    }

    const recentDuplicate = await prisma.donation.findFirst({
      where: {
        mobile: parsed.data.mobile,
        amount: parsed.data.amount,
        method: parsed.data.method,
        status: "PENDING",
        createdAt: {
          gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
      },
      select: { referenceNo: true },
      orderBy: { createdAt: "desc" },
    });

    if (recentDuplicate) {
      return NextResponse.json(
        {
          error: `A pending report already exists for this mobile, amount, and method (${recentDuplicate.referenceNo}). Please wait for board confirmation.`,
        },
        { status: 409 },
      );
    }

    let proofUrl: string | null = null;
    if (hasProof && proof instanceof File) {
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

    if (donation.email) {
      void notifyDonorDonationReceived({
        email: donation.email,
        referenceNo: donation.referenceNo,
        donorName: donation.donorName,
        amount: donation.amount,
        method: donation.method,
      });
    }

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
