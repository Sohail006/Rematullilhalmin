type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ||
    "Al Sirat Ul Mustaqeem Foundation <onboarding@resend.dev>";

  if (!apiKey) {
    console.info("[email] Skipped (RESEND_API_KEY not set):", input.subject);
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[email] Failed:", text);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[email] Error:", error);
    return false;
  }
}

export async function notifyAdminNewApplication(input: {
  referenceNo: string;
  fullName: string;
  schoolName: string;
  feeAmount: number;
}) {
  const to =
    process.env.ADMIN_NOTIFY_EMAIL ||
    (await import("@/lib/settings").then((m) => m.getContactSettings())).email;

  if (!to) return;

  await sendEmail({
    to,
    subject: `New aid application: ${input.referenceNo}`,
    html: `
      <p>A new educational aid application was submitted.</p>
      <ul>
        <li><strong>Reference:</strong> ${input.referenceNo}</li>
        <li><strong>Student:</strong> ${input.fullName}</li>
        <li><strong>School:</strong> ${input.schoolName}</li>
        <li><strong>Fee requested:</strong> PKR ${input.feeAmount.toLocaleString()}</li>
      </ul>
      <p>Log in to the board portal to review.</p>
    `,
  });
}

export async function notifyApplicantDecision(input: {
  email: string;
  referenceNo: string;
  fullName: string;
  action: "APPROVED" | "REJECTED";
  comments: string;
}) {
  const approved = input.action === "APPROVED";
  await sendEmail({
    to: input.email,
    subject: `Application ${input.referenceNo} — ${approved ? "Approved" : "Update"}`,
    html: `
      <p>Dear ${input.fullName},</p>
      <p>Your application <strong>${input.referenceNo}</strong> has been <strong>${input.action}</strong>.</p>
      <p><strong>Board comments:</strong> ${input.comments}</p>
      ${
        approved
          ? "<p>The foundation will contact you for next steps. Approved aid is paid directly to your school.</p>"
          : "<p>If you have questions, please contact the foundation.</p>"
      }
      <p>Al Sirat Ul Mustaqeem Foundation</p>
    `,
  });
}
