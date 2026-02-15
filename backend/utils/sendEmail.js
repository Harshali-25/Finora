const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
   const { EMAIL_USER, EMAIL_PASS, NODE_ENV } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    if (NODE_ENV !== "production") {
      console.warn("Email credentials missing. OTP will be available in API response.");
      return false;
    }

    throw new Error("Email credentials are not configured");
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
    return true;
  } catch (error) {
    if (NODE_ENV !== "production") {
      console.warn("Email send failed in non-production. Falling back without email.", error.message);
      return false;
    }

    throw error;
  }
};

module.exports = sendEmail;
