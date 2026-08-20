"use client";
import { Session } from "next-auth";

import SidebarFooterButtons from "./sidebar-footer";
import SidebarMenuButtons from "./sidebar-menu";

import RoleUser from "@/components/sidebar/role-user";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";

const SidebarNav = ({
  session,
  isAdmin,
}: {
  session: Session | null;
  isAdmin: boolean;
}) => {
  const { isMobile } = useSidebar();

  const accessList = session?.user?.accessList ?? [];
  const role = session?.user?.role;
  return (
    <Sidebar side={isMobile ? "right" : "left"}>
      <SidebarContent>
        <RoleUser role={role} />
        <SidebarMenuButtons isAdmin={isAdmin} accessList={accessList} />
      </SidebarContent>
      <SidebarFooterButtons />
    </Sidebar>
  );
};

export default SidebarNav;
