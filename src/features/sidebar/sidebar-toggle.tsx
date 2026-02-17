"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "../../components/ui/sidebar";

export function SidebarToggleButton() {
  const { toggleSidebar, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <button
      onClick={toggleSidebar}
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 
        z-50 md:hidden
        p-3 rounded-full bg-white shadow-lg 
        text-rd hover:bg-gray-100
      "
      aria-label="Toggle Sidebar"
    >
      <Menu />
    </button>
  );
}
