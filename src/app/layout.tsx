// next
import type { Metadata } from "next";
// intl
import { getLocale } from "next-intl/server";
// styles
import { Lora } from "next/font/google";
import "./globals.css";

// providers
// ui
import RootProviders from "@/providers/root-providers";
import { Toaster } from "sonner";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  display: "swap",
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${lora.variable} antialiased`}>
        <Toaster position="top-center" />
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
