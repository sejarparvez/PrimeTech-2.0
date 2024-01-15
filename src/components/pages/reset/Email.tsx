import SigninInput from "@/components/common/input/SignInInput";

export default function Email() {
  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        Please enter the email associated with your account. We will send you a
        verification code to reset your password.
      </p>
      <div className="flex flex-col gap-4">
        <label htmlFor="email" className="text-sm font-semibold">
          Email Address
        </label>
        <SigninInput
          name="email"
          id="email"
          type="email"
          placeholder="Email Address"
        />
      </div>
    </>
  );
}
