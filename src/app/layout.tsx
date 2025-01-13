import Footer from "@/components/layout/Footer";
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider session={session}>
              <Navbar />
              {children}
              <Footer />
            </Provider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
