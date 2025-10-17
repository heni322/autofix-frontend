'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { I18nProviderWrapper } from '@/components/I18nProvider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <html lang="en">
      <head>
        <title>Autofix - Book Garage Services Online</title>
        <meta name="description" content="Find and book garage services near you" />
      </head>
      <body>
        <I18nProviderWrapper>
          <QueryClientProvider client={queryClient}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" richColors />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </I18nProviderWrapper>
      </body>
    </html>
  );
}
