export const caseRegistrationTemplate = ({ clientName, caseNumber, caseType, caseDescription }) => {
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
            <p>Dear <strong>${clientName}</strong>,</p>
            <p>We are pleased to inform you that your case has been successfully registered with <strong>Law Firm Associates</strong>.</p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #1c1c1c; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Case Number:</strong> ${caseNumber}</p>
              <p style="margin: 5px 0;"><strong>Case Type:</strong> ${caseType}</p>
              ${caseDescription ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${caseDescription}</p>` : ''}
            </div>

            <p>Our legal team will review your case and get back to you shortly. You can use the case number mentioned above for any future reference or inquiries.</p>
            
            <p>If you have any questions or need immediate assistance, please feel free to contact us.</p>
            
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

