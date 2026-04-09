'use client';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import AdminDashboard from './Admin-Dashboard';

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Handle loading and unauthenticated states
  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/auth/signin');
    return null; // Prevent rendering until redirect
  }

  // Conditional rendering based on user role
  return (
    <main>
      {session?.user?.role === 'ADMIN' ? (
        // Admin-specific content
        <div className='container md:px-4'>
          <AdminDashboard />
        </div>
      ) : (
        // Content for logged-in users who are not admins
        <div className='container md:px-4'>
          <h1>User Dashboard</h1>
          <p>Welcome, {session?.user?.name}!</p>
        </div>
      )}
    </main>
  );
}
