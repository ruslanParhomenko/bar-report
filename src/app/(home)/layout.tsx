import ActionBar from "@/components/home-layout/footer-bar/footer-bar";
import HeaderBar from "@/components/home-layout/header-bar/header-bar";

import ScreenshotWrapper from "@/components/wrapper/screenshot-wrapper";
import SwipeWrapper from "@/components/wrapper/swipe-wrapper";
import { getUsers } from "@/features/settings/users/actions/get-users";
import SidebarNav from "@/features/sidebar/sidebar-nav";
import { AbilityProvider } from "@/providers/ability-provider";
import HomeUIProviders from "@/providers/home-ui-providers";
import MonthDaysProvider from "@/providers/month-days-provider";
import { headers } from "next/headers";
import { Suspense } from "react";

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
          <Suspense fallback={null}>
            <HeaderBar />
          </Suspense>
          <ScreenshotWrapper>
            <MonthDaysProvider>{children}</MonthDaysProvider>
          </ScreenshotWrapper>
          <Suspense fallback={null}>
            <ActionBar isAdmin={isAdmin} />
          </Suspense>
        </SwipeWrapper>
      </HomeUIProviders>
    </AbilityProvider>
  );
}
