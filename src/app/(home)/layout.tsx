import PumpkinSnow from "@/components/decor/pumpkin-snow";
import ActionBar from "@/components/home-layout/footer-bar/footer-bar";
import HeaderBar from "@/components/home-layout/header-bar/header-bar";
import SidebarNav from "@/components/home-layout/side-bar/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import ScreenshotWrapper from "@/components/wrapper/screenshot-wrapper";
import ClientRefProvider from "@/providers/client-ref-provider";
import EditProvider from "@/providers/edit-provider";
import MobileSidebarSwipe from "@/providers/mobile-sidebar-provider";
import ShowAnimationProvider from "@/providers/show-animation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <EditProvider>
        <ShowAnimationProvider>
          <ClientRefProvider>
            <SidebarNav />
            <MobileSidebarSwipe>
              <div className="flex h-dvh w-dvw flex-col px-1">
                <HeaderBar />

                <ScreenshotWrapper>
                  <PumpkinSnow count={25} />
                  {children}
                </ScreenshotWrapper>

                <ActionBar />
              </div>
            </MobileSidebarSwipe>
          </ClientRefProvider>
        </ShowAnimationProvider>
      </EditProvider>
    </SidebarProvider>
  );
}
