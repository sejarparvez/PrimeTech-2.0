'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from './RegistrationForm';
import RegistrationSkeleton from './loading';

export default function RegistrationPage() {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <>
        <RegistrationSkeleton />
      </>
    );
  }

  if (status === 'authenticated') {
    router.replace('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegistrationForm />
      </div>
    </div>
  );
}
