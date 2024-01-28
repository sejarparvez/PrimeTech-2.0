import Footer from "@/components/layout/Footer";
import LeftSidebar from "@/components/layout/LeftSidebar";
import Navbar from "@/components/layout/Navbar";
import { QueryProvider } from "@/provider/QueryProvider";
import Provider from "@/provider/SessionProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "../provider/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrimeTech",
  description: "PrimeTech is a technology based blog.",
};
interface RootLayoutProps {
  children: ReactNode;
  session: any;
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider session={session}>
              <div>
                <div className="md:grid md:grid-cols-24 lg:flex">
                  <div className="hidden w-20 md:col-span-2 md:block">
                    <LeftSidebar />
                  </div>
                  <div className="md:col-span-22 md:w-full md:border-l">
                    <Navbar />
                    <div className="mt-16">{children}</div>
                  </div>
                </div>
                <Footer />
              </div>
            </Provider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
