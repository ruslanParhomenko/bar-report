import { Session } from "next-auth";

import SidebarFooterButtons from "@/components/home-layout/side-bar/sidebar-footer";
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
  const role = session?.user?.role;

  return (
    <Sidebar>
      <SidebarContent>
        <div className="text-rd flex h-8 items-center justify-center text-xs">
          {role?.toLocaleLowerCase()}
        </div>
        <SidebarMenuButtons isAdmin={isAdmin} accessList={accessList} />
      </SidebarContent>
      <SidebarFooterButtons />
    </Sidebar>
  );
};

export default SidebarNav;
