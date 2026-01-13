import SidebarNav from "@/features/sidebar/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { redirect } from "next/navigation";
import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const NavPage = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  return (
    <SidebarProvider>
      <SidebarNav />
      <div className="pl-2 w-full">
        <NavMenuHeader />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default NavPage;
