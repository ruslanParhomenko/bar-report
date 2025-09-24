import SidebarNav from "@/features/nav/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";

const NavPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <SidebarNav />
      <section className="bg-background p-2 w-full">
        {children}
        <SpeedInsights />
      </section>
    </SidebarProvider>
  );
};

export default NavPage;
