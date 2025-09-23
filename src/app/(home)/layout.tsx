import SidebarNav from "@/features/nav/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";

const NavPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex w-full flex-col  bg-background ">
      <SidebarProvider>
        <SidebarNav />
        <section className="h-full w-full">
          <div className=" bg-background  ">
            {children}
            <SpeedInsights />
          </div>
        </section>
      </SidebarProvider>
    </div>
  );
};

export default NavPage;
