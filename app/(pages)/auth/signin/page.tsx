import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { LoginForm } from './signin-form';

export default async function LoginPage() {
  // 1. Get the session information
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Conditional Redirect
  // If a session exists (user is logged in), redirect them to the dashboard.
  if (session) {
    // Redirect to the post-login destination
    redirect('/dashboard');
  }

  // 3. Render the Login Form if no session exists
  return (
    <div className=' flex flex-col justify-center items-center'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <LoginForm />
      </div>
    </div>
  );
}
