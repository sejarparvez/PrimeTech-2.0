import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { TanstackProvider } from '../provider/QueryProvider';
import { ThemeProvider } from '../provider/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PrimeTech',
  description: 'PrimeTech is a technology based blog.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <TanstackProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>

            <Toaster richColors />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </TanstackProvider>
      </body>
    </html>
  );
}
