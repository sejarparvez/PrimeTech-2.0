"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginSkeleton from "./loading";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div>
        <LoginSkeleton />
      </div>
    );
  }

  if (status === "authenticated") {
    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
