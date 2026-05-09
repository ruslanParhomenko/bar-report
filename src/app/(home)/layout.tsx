import ActionBar from "@/components/home-layout/action-bar";
import HeaderBar from "@/components/home-layout/header-bar";
import ScreenshotWrapper from "@/components/wrapper/screenshot-wrapper";
import SidebarNav from "@/features/sidebar/sidebar-nav";
import HomeDataProviders from "@/providers/home-data-providers";
import HomeUIProviders from "@/providers/home-ui-providers";
import MonthDaysProvider from "@/providers/month-days-provider";
import ViewTransitionProvider from "@/providers/view-transition-provider";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeDataProviders>
      <HomeUIProviders>
        {/* <SidebarToggleButton /> */}
        <SidebarNav />
        <div className="flex h-dvh w-full flex-col px-1 pt-[env(safe-area-inset-top)] md:h-screen md:pt-0 md:pb-0">
          <HeaderBar />
          <ScreenshotWrapper>
            <ViewTransitionProvider>
              <MonthDaysProvider>{children}</MonthDaysProvider>
            </ViewTransitionProvider>
          </ScreenshotWrapper>
          <ActionBar />
        </div>
      </HomeUIProviders>
    </HomeDataProviders>
  );
}
