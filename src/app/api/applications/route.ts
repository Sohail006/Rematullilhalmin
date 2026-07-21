import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyAdminNewApplication } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { generateReferenceNo } from "@/lib/settings";
import { saveUploadedFile } from "@/lib/uploads";
import { applicationFormSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`apply:${ip}`, 5, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${limited.retryAfterSec}s.` },
        { status: 429 },
      );
    }

    const formData = await request.formData();

    const raw = {
      applicantType: String(formData.get("applicantType") || ""),
      fullName: String(formData.get("fullName") || ""),
      guardianName: String(formData.get("guardianName") || ""),
      cnic: String(formData.get("cnic") || ""),
      mobile: String(formData.get("mobile") || ""),
      email: String(formData.get("email") || ""),
      city: String(formData.get("city") || ""),
      address: String(formData.get("address") || ""),
      schoolName: String(formData.get("schoolName") || ""),
      schoolAddress: String(formData.get("schoolAddress") || ""),
      classGrade: String(formData.get("classGrade") || ""),
      previousMarks: String(formData.get("previousMarks") || ""),
      feeAmount: formData.get("feeAmount"),
      incomeInfo: String(formData.get("incomeInfo") || ""),
      hasDisability: formData.get("hasDisability") === "true",
      disabilityInfo: String(formData.get("disabilityInfo") || ""),
      declaration: formData.get("declaration") === "true",
    };

    const parsed = applicationFormSchema.safeParse(raw);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid form data";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (
      parsed.data.hasDisability &&
      !parsed.data.disabilityInfo?.trim()
    ) {
      return NextResponse.json(
        { error: "Please provide disability details" },
        { status: 400 },
      );
    }

    const existingPending = await prisma.application.findFirst({
      where: { cnic: parsed.data.cnic, status: "PENDING" },
    });
    if (existingPending) {
      return NextResponse.json(
        {
          error: `A pending application already exists for this CNIC (${existingPending.referenceNo}). Please wait for board review.`,
        },
        { status: 409 },
      );
    }

    const feeChallan = formData.get("feeChallan");
    const bForm = formData.get("bForm");
    const incomeCert = formData.get("incomeCert");

    if (
      !(feeChallan instanceof File) ||
      !(bForm instanceof File) ||
      !(incomeCert instanceof File) ||
      feeChallan.size === 0 ||
      bForm.size === 0 ||
      incomeCert.size === 0
    ) {
      return NextResponse.json(
        { error: "All three documents are required" },
        { status: 400 },
      );
    }

    const [feeChallanUrl, bFormUrl, incomeCertUrl] = await Promise.all([
      saveUploadedFile(feeChallan, "fee-challan"),
      saveUploadedFile(bForm, "b-form"),
      saveUploadedFile(incomeCert, "income-cert"),
    ]);

    const application = await prisma.application.create({
      data: {
        referenceNo: generateReferenceNo(),
        applicantType: parsed.data.applicantType,
        fullName: parsed.data.fullName,
        guardianName: parsed.data.guardianName,
        cnic: parsed.data.cnic,
        mobile: parsed.data.mobile,
        email: parsed.data.email || null,
        city: parsed.data.city,
        address: parsed.data.address,
        schoolName: parsed.data.schoolName,
        schoolAddress: parsed.data.schoolAddress,
        classGrade: parsed.data.classGrade,
        previousMarks: parsed.data.previousMarks,
        feeAmount: parsed.data.feeAmount,
        incomeInfo: parsed.data.incomeInfo,
        hasDisability: parsed.data.hasDisability,
        disabilityInfo: parsed.data.disabilityInfo || null,
        feeChallanUrl,
        bFormUrl,
        incomeCertUrl,
        status: "PENDING",
      },
    });

    void notifyAdminNewApplication({
      referenceNo: application.referenceNo,
      fullName: application.fullName,
      schoolName: application.schoolName,
      feeAmount: application.feeAmount,
    });

    return NextResponse.json({
      ok: true,
      referenceNo: application.referenceNo,
      id: application.id,
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to submit application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
