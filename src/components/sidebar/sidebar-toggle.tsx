"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export function SidebarToggleButton() {
  const { toggleSidebar, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <button
      onClick={toggleSidebar}
      className="text-rd fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-gray-100 md:hidden"
      aria-label="Toggle Sidebar"
    >
      <Menu />
    </button>
  );
}
