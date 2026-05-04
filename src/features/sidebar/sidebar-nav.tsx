"use client";
import {
  Sidebar,
  SidebarContent,
  useSidebar,
} from "../../components/ui/sidebar";
import SidebarFooterButtons from "./sidebar-footer";
import SidebarMenuButtons from "./sidebar-menu";

import RoleUser from "@/components/sidebar/role-user";

const SidebarNav = () => {
  const { isMobile } = useSidebar();
  return (
    <Sidebar side={isMobile ? "right" : "left"}>
      <SidebarContent>
        <RoleUser />
        <SidebarMenuButtons />
      </SidebarContent>
      <SidebarFooterButtons />
    </Sidebar>
  );
};

export default SidebarNav;
