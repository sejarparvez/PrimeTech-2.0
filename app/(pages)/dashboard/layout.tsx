import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import BreadCrumbComponent from '@/components/layout/sidebar/breadcrumb-component';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <BreadCrumbComponent />
        <div className='min-h-[80vh]'>{children}</div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
