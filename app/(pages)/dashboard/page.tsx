'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminDashboard from './Admin-Dashboard';

export default function Dashboard() {
  const { status, data: session } = useSession();
  const router = useRouter();

  // Handle loading and unauthenticated states
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') {
    router.push('/sign-in'); // Redirect to the sign-in page if not authenticated
    return null;
  }

  // Conditional rendering based on user role
  return (
    <main>
      {session?.user?.role === 'ADMIN' ? (
        // Admin-specific content
        <div className="container md:px-4">
          <AdminDashboard />
        </div>
      ) : (
        // Content for logged-in users who are not admins
        <div className="container md:px-4">
          <h1>User Dashboard</h1>
          <p>Welcome, {session?.user?.name}!</p>
        </div>
      )}
    </main>
  );
}
