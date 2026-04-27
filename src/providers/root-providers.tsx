import { SidebarProvider } from "@/components/ui/sidebar";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { SessionProviders } from "./session-providers";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProviders>
        <NextIntlClientProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </NextIntlClientProvider>
      </SessionProviders>
    </ThemeProvider>
  );
}
