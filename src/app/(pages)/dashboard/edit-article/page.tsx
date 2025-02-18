'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import EditArticleForm from './EditArticleFormField';

export default function NewDesign() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
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
      <div>
        <EditArticleForm id={id} />
      </div>
    </>
  );
}
