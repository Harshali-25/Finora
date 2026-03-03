const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const { EMAIL_USER, EMAIL_PASS, NODE_ENV } = process.env;

  // If credentials are missing, don't crash the server, just log it.
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("⚠️ EMAIL_USER or EMAIL_PASS missing in .env. OTP will only be visible in the backend console.");
    console.log(`DEBUG: OTP for ${to} is [ ${otp} ]`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS, // Reminder: Use a Google App Password, not your login password
      },
    });

    const mailOptions = {
      from: `"Finora" <${EMAIL_USER}>`,
      to,
      subject: "Finora Account Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #2563eb;">Verify Your Finora Account</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="background: #f3f4f6; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully to:", to);
    return true;
  } catch (error) {
    // We catch the error here so it doesn't trigger the 'catch' in authRoutes.js
    console.error("❌ Nodemailer Error:", error.message);
    console.log(`DEBUG: OTP for ${to} is [ ${otp} ]`);
    return false; 
  }
};

module.exports = sendEmail;