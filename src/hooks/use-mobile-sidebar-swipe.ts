"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useSwipeable } from "react-swipeable";

export function useMobileSidebarSwipe() {
  const { toggleSidebar, isMobile } = useSidebar();

  const handlers = useSwipeable({
    onSwipedLeft: (event) => {
      if (!isMobile) return;

      const screenWidth = window.innerWidth;
      const startX = event.initial[0];

      if (screenWidth - startX > 20) return;

      toggleSidebar();
    },

    trackMouse: false,
    trackTouch: true,

    delta: 20,

    preventScrollOnSwipe: false,
  });

  return isMobile ? { ...handlers } : {};
}
