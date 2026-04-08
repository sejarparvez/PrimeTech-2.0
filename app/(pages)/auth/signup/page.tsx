import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
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
    <div>
      <Navbar />
      <div className=' flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-sm md:max-w-4xl'>
          {/* The SignupForm component remains here */}
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
