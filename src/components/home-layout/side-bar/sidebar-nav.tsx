import SidebarFooterButtons from "@/components/home-layout/side-bar/sidebar-footer";
import SidebarHeader from "@/components/home-layout/side-bar/sidebar-header";
import SidebarMenuButtons from "@/components/home-layout/side-bar/sidebar-menu";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

const SidebarNav = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader />
        <SidebarMenuButtons />
      </SidebarContent>
      <SidebarFooterButtons />
    </Sidebar>
  );
};

export default SidebarNav;
