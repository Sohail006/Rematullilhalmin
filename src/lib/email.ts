type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.alsiratulmustaqeem.org.pk"
  ).replace(/\/$/, "");
}

function methodLabel(method: string) {
  if (method === "BANK") return "Bank transfer";
  if (method === "JAZZCASH") return "JazzCash";
  if (method === "EASYPAISA") return "EasyPaisa";
  return method;
}

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
        <li><strong>Reference:</strong> ${escapeHtml(input.referenceNo)}</li>
        <li><strong>Student:</strong> ${escapeHtml(input.fullName)}</li>
        <li><strong>School:</strong> ${escapeHtml(input.schoolName)}</li>
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
  const statusUrl = `${siteOrigin()}/en/status`;
  await sendEmail({
    to: input.email,
    subject: `Application ${input.referenceNo} — ${approved ? "Approved" : "Update"}`,
    html: `
      <p>Dear ${escapeHtml(input.fullName)},</p>
      <p>Your application <strong>${escapeHtml(input.referenceNo)}</strong> has been <strong>${escapeHtml(input.action)}</strong>.</p>
      <p><strong>Board comments:</strong> ${escapeHtml(input.comments)}</p>
      ${
        approved
          ? "<p>The foundation will contact you for next steps. Approved aid is paid directly to your school.</p>"
          : "<p>If you have questions, please contact the foundation.</p>"
      }
      <p>Check status: <a href="${statusUrl}">${statusUrl}</a></p>
      <p>Al Sirat Ul Mustaqeem Foundation</p>
    `,
  });
}

export async function notifyApplicantApplicationReceived(input: {
  email: string;
  referenceNo: string;
  fullName: string;
  schoolName: string;
  feeAmount: number;
}) {
  const statusUrl = `${siteOrigin()}/en/status`;
  await sendEmail({
    to: input.email,
    subject: `Application received: ${input.referenceNo}`,
    html: `
      <p>Dear ${escapeHtml(input.fullName)},</p>
      <p>We received your educational aid application.</p>
      <ul>
        <li><strong>Reference:</strong> ${escapeHtml(input.referenceNo)}</li>
        <li><strong>School:</strong> ${escapeHtml(input.schoolName)}</li>
        <li><strong>Fee requested:</strong> PKR ${input.feeAmount.toLocaleString()}</li>
      </ul>
      <p>Please save this reference number. You can check status anytime at
        <a href="${statusUrl}">${statusUrl}</a>
        using this reference and your CNIC / B-Form number.</p>
      <p>If approved, aid is paid directly to the school — not as cash to families.</p>
      <p>Al Sirat Ul Mustaqeem Foundation</p>
    `,
  });
}

export async function notifyAdminNewDonation(input: {
  referenceNo: string;
  donorName: string;
  amount: number;
  method: string;
}) {
  const to =
    process.env.ADMIN_NOTIFY_EMAIL ||
    (await import("@/lib/settings").then((m) => m.getContactSettings())).email;

  if (!to) return;

  await sendEmail({
    to,
    subject: `New donation report: ${input.referenceNo}`,
    html: `
      <p>A donor reported a payment for the foundation.</p>
      <ul>
        <li><strong>Reference:</strong> ${escapeHtml(input.referenceNo)}</li>
        <li><strong>Donor:</strong> ${escapeHtml(input.donorName)}</li>
        <li><strong>Amount:</strong> PKR ${input.amount.toLocaleString()}</li>
        <li><strong>Method:</strong> ${escapeHtml(methodLabel(input.method))}</li>
      </ul>
      <p>Log in to the board portal to confirm the donation.</p>
    `,
  });
}

export async function notifyDonorDonationReceived(input: {
  email: string;
  referenceNo: string;
  donorName: string;
  amount: number;
  method: string;
}) {
  const statusUrl = `${siteOrigin()}/en/status`;
  await sendEmail({
    to: input.email,
    subject: `Donation report received: ${input.referenceNo}`,
    html: `
      <p>Dear ${escapeHtml(input.donorName)},</p>
      <p>JazakAllah khair. We received your donation report.</p>
      <ul>
        <li><strong>Reference:</strong> ${escapeHtml(input.referenceNo)}</li>
        <li><strong>Amount:</strong> PKR ${input.amount.toLocaleString()}</li>
        <li><strong>Method:</strong> ${escapeHtml(methodLabel(input.method))}</li>
      </ul>
      <p>Please save this reference number. You can check status anytime at
        <a href="${statusUrl}">${statusUrl}</a>
        using this reference and your mobile number.</p>
      <p>The board will verify the payment and update the status after confirmation.</p>
      <p>Al Sirat Ul Mustaqeem Foundation</p>
    `,
  });
}

export async function notifyDonorDonationStatus(input: {
  email: string;
  referenceNo: string;
  donorName: string;
  action: "CONFIRMED" | "REJECTED";
  comments: string;
}) {
  const confirmed = input.action === "CONFIRMED";
  const statusUrl = `${siteOrigin()}/en/status`;
  await sendEmail({
    to: input.email,
    subject: `Donation ${input.referenceNo} — ${confirmed ? "Confirmed" : "Update"}`,
    html: `
      <p>Dear ${escapeHtml(input.donorName)},</p>
      <p>Your donation report <strong>${escapeHtml(input.referenceNo)}</strong> has been <strong>${escapeHtml(input.action)}</strong>.</p>
      <p><strong>Board comments:</strong> ${escapeHtml(input.comments)}</p>
      ${
        confirmed
          ? "<p>JazakAllah khair for supporting education through Al Sirat Ul Mustaqeem Foundation.</p>"
          : "<p>If you believe this is a mistake, please contact the foundation with your reference and proof.</p>"
      }
      <p>Check status: <a href="${statusUrl}">${statusUrl}</a></p>
      <p>Al Sirat Ul Mustaqeem Foundation</p>
    `,
  });
}
