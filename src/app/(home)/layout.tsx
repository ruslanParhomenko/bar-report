import ActionBar from "@/components/home-layout/footer-bar/footer-bar";
import HeaderBar from "@/components/home-layout/header-bar/header-bar";
import SidebarNav from "@/components/home-layout/side-bar/sidebar-nav";

import ScreenshotWrapper from "@/components/wrapper/screenshot-wrapper";
import SwipeWrapper from "@/components/wrapper/swipe-wrapper";

import { getUsers } from "@/features/users/actions/get-users";
import { authOptions } from "@/lib/auth";
import { AbilityProvider } from "@/providers/ability-provider";
import HomeUIProviders from "@/providers/home-ui-providers";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [users, headerStore, session] = await Promise.all([
    getUsers(),
    headers(),
    getServerSession(authOptions),
  ]);
  if (!users) return null;
  const isAdmin = headerStore.get("x-is-admin") === "true";
  return (
    <AbilityProvider users={users}>
      <HomeUIProviders>
        <SidebarNav session={session} isAdmin={isAdmin} />
        <SwipeWrapper>
          <HeaderBar />
          <ScreenshotWrapper>{children}</ScreenshotWrapper>
          <ActionBar isAdmin={isAdmin} />
        </SwipeWrapper>
      </HomeUIProviders>
    </AbilityProvider>
  );
}
