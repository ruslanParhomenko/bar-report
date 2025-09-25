import { Sidebar, SidebarContent } from "../../components/ui/sidebar";
import { SidebarToggleButton } from "@/components/switches/SidebarToggleButton";
import SidebarFooterButtons from "./SidebarFooterButtons";
import SidebarMenuButtons from "./SidebarMeniuButtons";
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
