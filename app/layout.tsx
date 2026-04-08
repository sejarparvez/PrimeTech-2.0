import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '../provider/QueryProvider';

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
        <QueryProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}

            <Toaster richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
