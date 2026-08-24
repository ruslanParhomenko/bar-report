// hooks/use-tab-swipe-navigation.ts
"use client";

import { TABS_BY_ROUTE } from "@/components/home-layout/header-bar/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname, useSearchParams } from "next/navigation";
import { useSwipeable } from "react-swipeable";

export function useTabSwipeNavigation() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mainRoute = pathname.split("/")[1] || "";
  const STORAGE_KEY = `nav-tab-${pathname}`;

  const TABS = (TABS_BY_ROUTE[mainRoute as keyof typeof TABS_BY_ROUTE] ??
    []) as readonly string[];

  const tab = searchParams.get("tab");

  const handleTabChange = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  const goToTab = (direction: 1 | -1) => {
    if (TABS.length === 0) return;
    const currentIndex = TABS.indexOf(tab ?? "");
    const nextIndex = (currentIndex + direction + TABS.length) % TABS.length;
    handleTabChange(TABS[nextIndex]);
  };

  const delta = isMobile ? 300 : 50;

  const handlers = useSwipeable({
    delta,
    swipeDuration: 1000,
    preventScrollOnSwipe: true,
    onSwipedLeft: () => goToTab(1),
    onSwipedRight: () => goToTab(-1),
  });

  return { handlers, tab, handleTabChange };
}
