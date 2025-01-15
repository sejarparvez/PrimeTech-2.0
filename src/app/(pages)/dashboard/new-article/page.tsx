"use client";
import BreadCrumb from "@/components/layout/admin/BreadCrumb";
import { DashboardSidebar } from "@/components/layout/admin/DashboardSidebar";
import Footer from "@/components/layout/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import NewArticleForm from "./NewArticleFormField";
import "./style.scss";

export default function NewDesign() {
  const { status } = useSession();
  const router = useRouter();

  // Enhanced form reset function

  // Handle loading and unauthenticated states
  if (status === "loading") return "loading...";
  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  return (
    <>
      <SidebarProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <DashboardSidebar />
        </Suspense>
        <main className="w-full">
          <BreadCrumb />
          <div className="container">
            <NewArticleForm />
          </div>
          <Footer />
        </main>
      </SidebarProvider>
    </>
  );
}
