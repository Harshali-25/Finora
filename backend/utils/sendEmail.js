const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, content) => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("⚠️ Email credentials missing. Check .env");
    console.log(`DEBUG: Mail to ${to} | Subject: ${subject}`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Finora" <${EMAIL_USER}>`,
      to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #2563eb;">Finora Notifications</h2>
          ${content}
          <p style="margin-top: 20px; font-size: 12px; color: #888;">This is an automated message from your Finora Trading Dashboard.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    return false; 
  }
};

module.exports = sendEmail;