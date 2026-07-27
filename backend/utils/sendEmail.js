const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, content) => {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  console.log("========== EMAIL DEBUG ==========");
  console.log("EMAIL_USER:", EMAIL_USER);
  console.log("EMAIL_PASS Exists:", !!EMAIL_PASS);
  console.log("Sending email to:", to);

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("❌ Email credentials are missing!");
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

    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ Gmail SMTP Connected");

    const mailOptions = {
      from: `"Finora" <${EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: content,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    return true;
  } catch (error) {
    console.error("❌ FULL NODEMAILER ERROR:");
    console.error(error);

    return false;
  }
};

module.exports = sendEmail;