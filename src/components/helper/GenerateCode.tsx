export default function generateVerificationCode() {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
}
