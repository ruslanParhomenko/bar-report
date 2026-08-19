import ActionBar from "@/components/home-layout/footer-bar/footer-bar";
import HeaderBar from "@/components/home-layout/header-bar/header-bar";

import ScreenshotWrapper from "@/components/wrapper/screenshot-wrapper";
import SwipeWrapper from "@/components/wrapper/swipe-wrapper";
import SidebarNav from "@/features/sidebar/sidebar-nav";
import { getUsers } from "@/features/users/actions/get-users";
import { AbilityProvider } from "@/providers/ability-provider";
import HomeUIProviders from "@/providers/home-ui-providers";
import MonthDaysProvider from "@/providers/month-days-provider";
import { headers } from "next/headers";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [users, headerStore] = await Promise.all([getUsers(), headers()]);
  if (!users || !headerStore) return null;
  const isAdmin = headerStore.get("x-is-admin") === "true";
  return (
    <AbilityProvider users={users}>
      <HomeUIProviders>
        <SidebarNav />
        <SwipeWrapper>
          <HeaderBar />

          <ScreenshotWrapper>
            <MonthDaysProvider>{children}</MonthDaysProvider>
          </ScreenshotWrapper>

          <ActionBar isAdmin={isAdmin} />
        </SwipeWrapper>
      </HomeUIProviders>
    </AbilityProvider>
  );
}
