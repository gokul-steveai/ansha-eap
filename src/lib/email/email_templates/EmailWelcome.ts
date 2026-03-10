export const EMAIL_WELCOME_TEMPLATE = () => {
    return `
    <div style="background: radial-gradient(circle at top left,     #D6FCF9 0%, transparent 50%),  radial-gradient(circle at top center,   #FFECFD 0%, transparent 50%),  radial-gradient(circle at top right,    #ECFFE8 0%, transparent 50%),  radial-gradient(circle at bottom right, #E5E7FF 0%, transparent 50%),  radial-gradient(circle at bottom center,#FFFEEF 0%, transparent 50%),  radial-gradient(circle at bottom left,  #F7E1E0 0%, transparent 50%);padding:40px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:30px 20px;">

    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          
          <!-- Outer container -->
          <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background:white; border-radius:20px; overflow:hidden;">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding:25px;">
                <img 
                  src="https://elevate.ansahealth.com.au/assets/images/elevate-dark.png" 
                  alt="Elevate Logo" 
                  width="100" 
                  style="display:block; border:0; outline:none; text-decoration:none;"
                />
              </td>
            </tr>

            <!-- Header -->
            <tr>
              <td align="center" style="padding:0 35px;">
                <h1 style="margin:0; font-size:24px; font-weight:600; color:#333;">
                  Welcome to Elevate!
                </h1>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:15px 35px 0;">
                <p style="margin:0; font-size:16px; color:#555; line-height:1.6;">
                  Thank you for signing up. Your Elevate account is now active and ready to use.
                </p>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding:25px 35px;">
                <p style="margin:0; font-size:16px; color:#555; line-height:1.6;">
                  Inside the app, you’ll find essential resources and contacts designed to support you—especially during urgent or emergency situations. Everything you need is organised and easy to access when it matters most.
                </p>

                <p style="margin:18px 0 0; font-size:16px; color:#555; line-height:1.6;">
                  You can also book telehealth appointments directly through the app, making it simple to connect with a healthcare professional whenever you need support.
                </p>

                <p style="margin:18px 0 0; font-size:16px; color:#555; line-height:1.6;">
                  If you have questions or need assistance, our team is always here to help.
                </p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding:10px 35px 30px;">
                <a 
                  href="https://elevate.ansahealth.com.au" 
                  style="
                    background:#2FAAB3; 
                    color:#ffffff; 
                    text-decoration:none; 
                    padding:12px 28px; 
                    border-radius:6px; 
                    font-size:16px;
                    display:inline-block;
                  "
                >
                  Open Elevate
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:20px 35px; background:#fafafa;">
                <p style="margin:0; font-size:13px; color:#999;">
                  © 2025 Elevate. All rights reserved.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
</div>`
}