export default function generateVerificationCode(): string {
  // Generate a random 6-digit numerical code
  const min = 100000; // Minimum value for a 6-digit code
  const max = 999999; // Maximum value for a 6-digit code
  const verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return verificationCode.toString();
}
