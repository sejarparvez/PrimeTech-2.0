import BreadCrumb from '@/components/layout/admin/BreadCrumb';
import { DashboardSidebar } from '@/components/layout/admin/DashboardSidebar';
import Footer from '@/components/layout/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode, Suspense } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <DashboardSidebar />
        </Suspense>
        <main className="w-full">
          <BreadCrumb />
          <div className="container md:px-4">{children}</div>
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
}
