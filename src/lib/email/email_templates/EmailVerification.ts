export const EMAIL_VERIFICATION_TEMPLATE = (
  { code }: { code: string }
): string => {
  const currentYear = new Date().getFullYear()

  return `
  <div style="background: radial-gradient(circle at top left,     #D6FCF9 0%, transparent 50%),  radial-gradient(circle at top center,   #FFECFD 0%, transparent 50%),  radial-gradient(circle at top right,    #ECFFE8 0%, transparent 50%),  radial-gradient(circle at bottom right, #E5E7FF 0%, transparent 50%),  radial-gradient(circle at bottom center,#FFFEEF 0%, transparent 50%),  radial-gradient(circle at bottom left,  #F7E1E0 0%, transparent 50%);padding:40px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      <div style="background-color:#0d2445;color:#ffffff;text-align:center;padding:20px 0;font-size:20px;font-weight:600;">
        Email Verification
      </div>
      <div style="padding:32px 28px;text-align:center;">
        <p style="margin:0 0 16px;line-height:1.6;font-size:15px;color:#444;">
          Please use the code below to verify your email address:
        </p>
        <div style="display:inline-block;background: #edf9f4;color: #4fc491;padding:12px 28px;border-radius:8px;font-size:24px;font-weight:700;letter-spacing:3px;margin:20px 0;border: 1px solid #a7f2d2;">
          ${code || "------"}
        </div>
        <p style="margin:16px 0 0;line-height:1.6;font-size:14px;color:#555;">
          This code will expire in 2 minutes. If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
      <div style="border-top:1px solid #e5e7eb;text-align:center;padding:20px;font-size:13px;color:#6b7280;background:#fafafa;">
        &copy; ${currentYear} Elevate | Ansa Health
      </div>
    </div>
  </div>
  `
}
