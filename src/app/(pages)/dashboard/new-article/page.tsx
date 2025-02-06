'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NewArticleForm from './NewArticleFormField';

export default function NewDesign() {
  const { status } = useSession();
  const router = useRouter();

  // Enhanced form reset function

  // Handle loading and unauthenticated states
  if (status === 'loading') return 'loading...';
  if (status === 'unauthenticated') {
    router.push('/sign-in');
    return null;
  }

  return (
    <>
      <div className="md:mx-2">
        <NewArticleForm />
      </div>
    </>
  );
}
