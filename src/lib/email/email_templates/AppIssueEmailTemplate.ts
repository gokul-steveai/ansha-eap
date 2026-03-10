import { SupportFormData } from "@/serverActions/submitSupportTicket";

export const APP_ISSUE_EMAIL_TEMPLATE = (data: SupportFormData): string => {
  const currentYear = new Date().getFullYear();

  return `
  <div style="background: radial-gradient(circle at top left, #FEE2E2 0%, transparent 50%), radial-gradient(circle at bottom right, #FECACA 0%, transparent 50%); padding:40px 0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08); border: 2px solid #ef4444;">
      
      <!-- Header -->
      <div style="background-color:#b91c1c; color:#ffffff; text-align:center; padding:20px 0; font-size:20px; font-weight:700;">
        ⚠️ Web App Issue
      </div>

      <!-- Body -->
      <div style="padding:32px 28px; font-size:15px; color:#111; line-height:1.6;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> <span style="color:#b91c1c; font-weight:600;">${data.company}</span></p>
        <p><strong>Description of the issue:</strong> ${data.message}</p>
      </div>

      <!-- Footer -->
      <div style="border-top:1px solid #e5e7eb; text-align:center; padding:20px; font-size:13px; color:#6b7280; background:#fafafa;">
        &copy; ${currentYear} Elevate | Ansa Health
      </div>
    </div>
  </div>
  `;
};
