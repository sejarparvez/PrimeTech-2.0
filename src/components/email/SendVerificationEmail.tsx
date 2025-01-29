import { createTransporter } from '@/lib/nodemailer';
import { render } from '@react-email/components';
import VerificationEmailTemplate from './VerificationEmailTemplate'; // Assuming this imports your component

export async function sendVerificationEmail(
  email: string,
  verificationCode: string
) {
  const transporter = createTransporter();

  // Await the render function to resolve the Promise and get the HTML content
  const emailHtml = await render(
    <VerificationEmailTemplate verificationCode={verificationCode} />
  );

  const mailData = {
    from: process.env.SMTP_USER, // sender address
    to: email, // recipient email
    subject: 'User Registration Verification Code', // Subject line
    text: `Your verification code for user registration: ${verificationCode} | Sent from: PrimeTech`, // plain text fallback
    html: emailHtml, // The HTML content from JSX (resolved HTML string)
  };

  // Send the email using the transporter
  await transporter.sendMail(mailData);
}
