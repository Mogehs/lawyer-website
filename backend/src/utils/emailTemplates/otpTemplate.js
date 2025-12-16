export const otpTemplate = ({name, otp}) => {
  return `
  <html>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 20px;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #1c1c1c; color: #ffffff; text-align: center; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <h2 style="margin: 0;">Law Firm Associates</h2>
            <p style="margin: 0;">Your Trusted Legal Advisors</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for signing up with <strong>Law Firm Associates</strong>. To verify your account, please use the following One-Time Password (OTP):</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background-color: #1c1c1c; color: #ffffff; padding: 12px 30px; border-radius: 6px; font-size: 22px; letter-spacing: 2px;">
                ${otp}
              </span>
            </div>
            <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
            <p>Best Regards,<br><strong>Law Firm Associates</strong><br><em>Legal Services Team</em></p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; color: #555; text-align: center; font-size: 12px; padding: 15px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            © ${new Date().getFullYear()} Law Firm Associates. All Rights Reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
