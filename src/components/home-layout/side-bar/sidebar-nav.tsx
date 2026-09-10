import { Session } from "next-auth";

import SidebarFooterButtons from "@/components/home-layout/side-bar/sidebar-footer";
import SidebarHeader from "@/components/home-layout/side-bar/sidebar-header";
import SidebarMenuButtons from "@/components/home-layout/side-bar/sidebar-menu";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

const SidebarNav = ({
  session,
  isAdmin,
}: {
  session: Session | null;
  isAdmin: boolean;
}) => {
  const accessList = session?.user?.accessList ?? [];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader session={session} />
        <SidebarMenuButtons isAdmin={isAdmin} accessList={accessList} />
      </SidebarContent>
      <SidebarFooterButtons />
    </Sidebar>
  );
};

export default SidebarNav;
