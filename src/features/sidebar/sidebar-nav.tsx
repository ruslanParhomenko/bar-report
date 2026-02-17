import { Sidebar, SidebarContent } from "../../components/ui/sidebar";
import { SidebarToggleButton } from "@/features/sidebar/sidebar-toggle";
import SidebarFooterButtons from "./sidebar-footer";
import SidebarMenuButtons from "./sidebar-menu";
import SidebarRoleUserButton from "./sidebar-role-user";

const SidebarNav = () => {
  return (
    <>
      <SidebarToggleButton />
      <Sidebar>
        <SidebarContent>
          <SidebarRoleUserButton />
          <SidebarMenuButtons />
        </SidebarContent>
        <SidebarFooterButtons />
      </Sidebar>
    </>
  );
};

export default SidebarNav;
