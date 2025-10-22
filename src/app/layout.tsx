import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { SessionProviders } from "@/providers/SessionProviders";
import { AbilityProvider } from "@/providers/AbilityProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

import { ThemeProvider } from "next-themes";
import { getEmployees } from "./actions/employees/getEmployees";
import {
  EmployeesContextValue,
  EmployeesProvider,
} from "@/providers/EmployeesProvider";
import { getUsers } from "./actions/users/getUsers";
import { Toaster } from "@/components/ui/sonner";
import {
  SchedulesContextValue,
  SchedulesProvider,
} from "@/providers/ScheduleProvider";
import { getSchedule } from "./actions/schedule/getSchedule";

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
  const schedules = await getSchedule();
  const users = await getUsers();

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
                <AbilityProvider users={users}>
                  <EmployeesProvider
                    employees={employees as EmployeesContextValue[]}
                  >
                    <SchedulesProvider
                      schedules={schedules as SchedulesContextValue[]}
                    >
                      {children}
                    </SchedulesProvider>
                  </EmployeesProvider>
                </AbilityProvider>
              </ReactQueryProvider>
            </NextIntlClientProvider>
          </SessionProviders>
          {/* <Toaster position="bottom-right" /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
