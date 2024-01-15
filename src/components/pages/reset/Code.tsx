import SigninInput from "@/components/common/input/SignInInput";

export default function Code() {
  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        Enter the verification code sent to your email. Check your spam folder
        also.
      </p>
      <div className="flex flex-col gap-4">
        <label htmlFor="verificationCode" className="text-sm font-semibold">
          Verification Code
        </label>
        <SigninInput
          type="text"
          id="code"
          name="code"
          placeholder="Enter verification code"
        />
      </div>
    </>
  );
}
