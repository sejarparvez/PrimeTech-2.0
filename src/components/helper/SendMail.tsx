import nodemailer from "nodemailer";

export default async function sendVerificationEmail(
  email: string,
  verificationCode: string,
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailData = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "User Registration Verification Code",
    text: `Your verification code for user registration: ${verificationCode} | Sent from: PrimeTech`,
    html: `<p>Your verification code for creating new user: <strong>${verificationCode}</strong></p><p>Sent from: PrimeTech</p>`,
  };

  await transporter.sendMail(mailData);
}
