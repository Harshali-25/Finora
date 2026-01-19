const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Finora" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Finora Account Verification OTP",
      html: `
        <h2>Verify Your Finora Account</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="color: #2563eb;">${otp}</h1>
        <p>This OTP is valid for <b>10 minutes</b>.</p>
        <br/>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to:", to);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;
