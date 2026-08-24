import ActionBar from "@/components/home-layout/footer-bar/footer-bar";
import HeaderBar from "@/components/home-layout/header-bar/header-bar";
import SidebarNav from "@/components/home-layout/side-bar/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";

import ScreenshotWrapper from "@/components/wrapper/screenshot-wrapper";

import { authOptions } from "@/lib/auth";
import ClientRefProvider from "@/providers/client-ref-provider";
import EditProvider from "@/providers/edit-provider";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerStore, session] = await Promise.all([
    headers(),
    getServerSession(authOptions),
  ]);
  const isAdmin = headerStore.get("x-is-admin") === "true";
  return (
    <SidebarProvider>
      <EditProvider>
        <ClientRefProvider>
          <SidebarNav session={session} isAdmin={isAdmin} />
          <div className="flex h-dvh w-full flex-col px-1 pt-[env(safe-area-inset-top)] md:h-screen md:pt-0 md:pb-0">
            <HeaderBar />
            <ScreenshotWrapper>{children}</ScreenshotWrapper>
            <ActionBar isAdmin={isAdmin} />
          </div>
        </ClientRefProvider>
      </EditProvider>
    </SidebarProvider>
  );
}
