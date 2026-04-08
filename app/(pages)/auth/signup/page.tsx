import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SignupForm } from './signup-form';

export default async function SignupPage() {
  // 1. Get the session information
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Conditional Redirect
  // If a session exists (meaning the user is logged in), redirect them
  // to the dashboard page or another appropriate post-login page.
  if (session) {
    // Specify the path to your dashboard or home page
    redirect('/dashboard');
  }

  // 3. Render the Signup Form if no session exists
  return (
    <div className='flex items-center justify-center mx-auto'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <SignupForm />
      </div>
    </div>
  );
}
