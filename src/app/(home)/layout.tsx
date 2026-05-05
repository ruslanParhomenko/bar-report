import ActionBar from "@/components/home-layout/action-bar";
import NavTabs from "@/components/home-layout/header-bar";
import ScreenshotWrapper from "@/components/wrapper/screenshot-wrapper";
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
        {/* <SidebarToggleButton /> */}
        <SidebarNav />
        <div className="flex h-dvh w-full flex-col px-1 md:h-screen">
          <NavTabs />
          <ScreenshotWrapper>
            <MonthDaysProvider>{children}</MonthDaysProvider>
          </ScreenshotWrapper>
          <ActionBar />
        </div>
      </HomeUIProviders>
    </HomeDataProviders>
  );
}
