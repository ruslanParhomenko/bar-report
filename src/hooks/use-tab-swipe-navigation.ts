"use client";

import { saveTab } from "@/app/actions/save-tab";
import { TABS_BY_ROUTE } from "@/components/home-layout/header-bar/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSwipeable } from "react-swipeable";

export function useTabSwipeNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const mainRoute = pathname.split("/")[1] || "";

  const TABS = (TABS_BY_ROUTE[mainRoute as keyof typeof TABS_BY_ROUTE] ??
    []) as readonly string[];

  const tab = searchParams.get("tab");

  const handleTabChange = async (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    // window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    await saveTab(mainRoute, value);

    router.replace(`${pathname}?${params.toString()}`);
  };

  const goToTab = (direction: 1 | -1) => {
    if (TABS.length === 0) return;
    const currentIndex = TABS.indexOf(tab ?? "");
    const nextIndex = (currentIndex + direction + TABS.length) % TABS.length;
    handleTabChange(TABS[nextIndex]);
  };

  const delta = 200;

  const handlers = useSwipeable({
    delta,
    swipeDuration: 2000,
    preventScrollOnSwipe: true,
    onSwipedLeft: () => goToTab(1),
    onSwipedRight: () => goToTab(-1),
  });

  return { handlers, tab, handleTabChange };
}
