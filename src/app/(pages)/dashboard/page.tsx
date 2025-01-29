'use client';
import BreadCrumb from '@/components/layout/admin/BreadCrumb';
import { DashboardSidebar } from '@/components/layout/admin/DashboardSidebar';
import Footer from '@/components/layout/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';
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
    <div>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="w-full">
          <BreadCrumb />
          <div className="flex">
            <main className="w-full">
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
          </div>
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
}
