// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail77.lwspanel.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: options.from,
      to: options.to || "Confirmation de réception",
      text: options.text || "Merci pour votre envoi.",
      subject: options.subject,
      html: options.html,
      headers: options.headers,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`Email envoyé à ${options.to}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Échec de l'envoi de l'email");
  }
};

module.exports = sendEmail;
