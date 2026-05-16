"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { TABS_BY_ROUTE } from "../home-layout/header-bar/constants";

export default function SwipeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1] || "";

  const STORAGE_KEY = `nav-tab-${pathname}`;

  const TABS = (TABS_BY_ROUTE[mainRoute as keyof typeof TABS_BY_ROUTE] ??
    []) as readonly string[];

  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const handleTabChange = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  const handlers = useSwipeable({
    delta: 50,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    onSwipedLeft: () => {
      const currentIndex = TABS.indexOf(tab ?? "");
      const nextIndex = (currentIndex + 1) % TABS.length;
      const nextTab = TABS[nextIndex];
      handleTabChange(nextTab);
    },
    onSwipedRight: () => {
      const currentIndex = TABS.indexOf(tab ?? "");
      const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      const prevTab = TABS[prevIndex];
      handleTabChange(prevTab);
    },
  });
  return (
    <div
      {...handlers}
      className="flex h-dvh w-full flex-col px-1 pt-[env(safe-area-inset-top)] md:h-screen md:pt-0 md:pb-0"
    >
      {children}
    </div>
  );
}
