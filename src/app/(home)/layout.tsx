import ActionBar from "@/components/home-layout/footer-bar/footer-bar";
import HeaderBar from "@/components/home-layout/header-bar/header-bar";
import SidebarNav from "@/components/home-layout/side-bar/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";

import ScreenshotWrapper from "@/components/wrapper/screenshot-wrapper";
import SwipeWrapper from "@/components/wrapper/swipe-wrapper";

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
          <SwipeWrapper>
            <HeaderBar />
            <ScreenshotWrapper>{children}</ScreenshotWrapper>
            <ActionBar isAdmin={isAdmin} />
          </SwipeWrapper>
        </ClientRefProvider>
      </EditProvider>
    </SidebarProvider>
  );
}
