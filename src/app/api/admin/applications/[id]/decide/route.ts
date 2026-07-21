import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { notifyApplicantDecision } from "@/lib/email";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || !hasPermission(session, "applications.decide")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const action: "APPROVED" | "REJECTED" | null =
      body.action === "APPROVED"
        ? "APPROVED"
        : body.action === "REJECTED"
          ? "REJECTED"
          : null;
    const comments = String(body.comments || "").trim();

    if (!action) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    if (comments.length < 5) {
      return NextResponse.json(
        { error: "Comments are required" },
        { status: 400 },
      );
    }

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (application.status !== "PENDING") {
      return NextResponse.json(
        { error: "Application already decided" },
        { status: 400 },
      );
    }

    await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: { status: action },
      }),
      prisma.applicationDecision.create({
        data: {
          applicationId: id,
          decidedById: session.id,
          action,
          comments,
        },
      }),
    ]);

    if (application.email) {
      void notifyApplicantDecision({
        email: application.email,
        referenceNo: application.referenceNo,
        fullName: application.fullName,
        action,
        comments,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Decision failed" }, { status: 500 });
  }
}
