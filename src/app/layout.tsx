import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { SessionProviders } from "@/providers/SessionProviders";
import { Toaster } from "react-hot-toast";
import { AbilityProvider } from "@/providers/AbilityProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

import { ThemeProvider } from "next-themes";
import { getEmployees } from "./actions/getEmploees";
import { EmployeesProvider } from "@/providers/EmployeesProvider";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
});

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
  const employees = await getEmployees();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${lora.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviders>
            <NextIntlClientProvider>
              <ReactQueryProvider>
                <AbilityProvider>
                  <EmployeesProvider employees={employees}>
                    {children}
                  </EmployeesProvider>
                </AbilityProvider>
              </ReactQueryProvider>
            </NextIntlClientProvider>
          </SessionProviders>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
