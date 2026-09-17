"use client";

import { useMobileSidebarSwipe } from "@/hooks/use-mobile-sidebar-swipe";

export default function MobileSidebarSwipe({
  children,
}: {
  children: React.ReactNode;
}) {
  const swipeHandlers = useMobileSidebarSwipe();

  return (
    <div {...swipeHandlers} className="contents">
      {children}
    </div>
  );
}
