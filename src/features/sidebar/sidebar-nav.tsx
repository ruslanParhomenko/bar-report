import { Sidebar, SidebarContent } from "../../components/ui/sidebar";
import SidebarFooterButtons from "./sidebar-footer";
import SidebarMenuButtons from "./sidebar-menu";

import RoleUser from "@/components/sidebar/role-user";

const SidebarNav = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <RoleUser />
        <SidebarMenuButtons />
      </SidebarContent>
      <SidebarFooterButtons />
    </Sidebar>
  );
};

export default SidebarNav;
