import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { QueryProvider } from '../provider/QueryProvider';
import Provider from '../provider/SessionProvider';
import { ThemeProvider } from '../provider/ThemeProvider';
import ClientSideToastContainer from '../provider/ToastProvider';
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
            <Provider>
              {children}
              <ClientSideToastContainer />
            </Provider>
            <Toaster richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
