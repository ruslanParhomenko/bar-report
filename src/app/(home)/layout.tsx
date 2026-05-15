import ActionBar from "@/components/home-layout/footer-bar/footer-bar";
import HeaderBar from "@/components/home-layout/header-bar/header-bar";

import ScreenshotWrapper from "@/components/wrapper/screenshot-wrapper";
import SwipeWrapper from "@/components/wrapper/swipe-wrapper";
import SidebarNav from "@/features/sidebar/sidebar-nav";
import HomeDataProviders from "@/providers/home-data-providers";
import HomeUIProviders from "@/providers/home-ui-providers";
import MonthDaysProvider from "@/providers/month-days-provider";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeDataProviders>
      <HomeUIProviders>
        <SidebarNav />
        <SwipeWrapper>
          <HeaderBar />
          <ScreenshotWrapper>
            <MonthDaysProvider>{children}</MonthDaysProvider>
          </ScreenshotWrapper>
          <ActionBar />
        </SwipeWrapper>
      </HomeUIProviders>
    </HomeDataProviders>
  );
}
