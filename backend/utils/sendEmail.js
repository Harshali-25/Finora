const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, content) => {
  try {
    console.log("========== RESEND EMAIL ==========");
    console.log("Sending to:", to);

    const data = await resend.emails.send({
      from: "Finora <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: content,
    });

    console.log("Email sent successfully");
    console.log(data);

    return true;
  } catch (error) {
    console.error("RESEND ERROR:");
    console.error(error);

    return false;
  }
};

module.exports = sendEmail;