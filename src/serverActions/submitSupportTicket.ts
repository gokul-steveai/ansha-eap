// app/actions.ts (or similar path)
"use server";

import { sendMail } from "@/lib/email/elasticemail";
import { APP_ISSUE_EMAIL_TEMPLATE } from "@/lib/email/email_templates/AppIssueEmailTemplate";

export type SupportFormData = {
    name: string;
    email: string;
    company: string;
    message: string;
};

export async function submitSupportTicket(formData:SupportFormData) {
  try {
    const payload = {
      to: "elevatesupport@ansahealth.com",
      cc: "dev@aiwebsiteservices.com,allaine@aiwebsiteservices.com",
      subject: `⚠️ Elevate App Issue`,
      htmlBody: APP_ISSUE_EMAIL_TEMPLATE(formData),
    };

    const sendMailRes = await sendMail(payload);
    return { success: sendMailRes.success };
  } catch (err) {
    console.error("Email Error:", err);
    return { success: false, error: "Failed to send email." };
  }
}