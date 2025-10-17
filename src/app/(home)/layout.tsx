import SidebarNav from "@/features/nav/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";

const NavPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <SidebarNav />
      <section className="bg-background py-2 px-4 w-full ">{children}</section>
    </SidebarProvider>
  );
};

export default NavPage;
