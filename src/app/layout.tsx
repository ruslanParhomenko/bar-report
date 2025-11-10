// next
import type { Metadata } from "next";
// intl
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
// styles
import { Lora } from "next/font/google";
import "./globals.css";

// providers
import { SessionProviders } from "@/providers/SessionProviders";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "next-themes";
import { DataProviderLayout } from "./data-provider-layout";
// ui
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
});

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

export const metadata: Metadata = {
  title: "Bar App",
  description: "Report schedule and orders",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${lora.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <SessionProviders>
            <NextIntlClientProvider>
              <ReactQueryProvider>
                <Suspense fallback={<Skeleton />}>
                  <DataProviderLayout>{children}</DataProviderLayout>
                </Suspense>
              </ReactQueryProvider>
            </NextIntlClientProvider>
          </SessionProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
