import { Sidebar, SidebarContent } from "../../components/ui/sidebar";
import { SidebarToggleButton } from "@/features/sidebar/SidebarToggleButton";
import SidebarFooterButtons from "./SidebarFooterButtons";
import SidebarMenuButtons from "./SidebarMenuButtons";
import SidebarRoleUserButton from "./SidebarRoleUserButton";

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
