"use client";
import SigninInput from "@/components/common/input/SignInInput";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Password() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <>
      <p className="mb-4 text-sm">Enter your new password.</p>
      <div className="flex flex-col gap-4">
        <label htmlFor="newPassword" className="text-sm font-semibold">
          New Password
        </label>
        <div className="relative">
          <SigninInput
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <label htmlFor="confirmPassword" className="text-sm font-semibold">
          Confirm Password
        </label>
        <div className="relative">
          <SigninInput
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm new password"
          />
        </div>
      </div>
    </>
  );
}
