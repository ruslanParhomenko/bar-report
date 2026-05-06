import type { Metadata, Viewport } from "next";

import { getLocale } from "next-intl/server";

import { Lora } from "next/font/google";
import "./globals.css";

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
  applicationName: "Bar App",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bar App",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
