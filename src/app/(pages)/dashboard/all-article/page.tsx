'use client';

import BreadCrumb from '@/components/layout/admin/BreadCrumb';
import { DashboardSidebar } from '@/components/layout/admin/DashboardSidebar';
import Footer from '@/components/layout/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import ArticleList from './ArticleList';

export default function AdminArticleList() {
  return (
    <div>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="w-full">
          <BreadCrumb />
          <div className="flex">
            <main className="w-full">
              <ArticleList />
            </main>
          </div>
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
}
