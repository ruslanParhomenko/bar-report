import { getLocale } from "next-intl/server";
import { Toaster } from "sonner";

import { lora, metadata, viewport } from "./layout-config";

import { SessionProviders } from "@/providers/session-providers";
import ThemeProviderClient from "@/providers/theme-provider-client";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

export { metadata, viewport };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${lora.variable} antialiased`}>
        <ThemeProviderClient>
          <SessionProviders>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </SessionProviders>
        </ThemeProviderClient>

        <Toaster position="top-center" />
      </body>
    </html>
  );
}
