"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useSwipeable } from "react-swipeable";

export function SidebarToggleButton() {
  const { toggleSidebar, isMobile } = useSidebar();

  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      if (eventData.initial[0] < 30 && eventData.deltaX > 60) {
        toggleSidebar();
      }
    },

    trackTouch: true,
    trackMouse: false,
    preventScrollOnSwipe: false, // важно — не ломает скролл
  });

  if (!isMobile) return null;

  return (
    <div
      {...handlers}
      className="fixed inset-0 z-0" // прозрачный слой
    />
  );
}
