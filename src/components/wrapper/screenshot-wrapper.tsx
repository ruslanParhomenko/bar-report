"use client";
import { TABS_BY_ROUTE } from "@/components/home-layout/header-bar/constants";
import { RefContext } from "@/providers/client-ref-provider";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useContext } from "react";
import { useSwipeable } from "react-swipeable";

export default function ScreenshotWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useContext(RefContext);
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
    trackMouse: true,
    preventScrollOnSwipe: false,
    delta: { left: 80, right: 80, up: 1000, down: 1000 },
    swipeDuration: 250,
  });
  return (
    <div
      {...handlers}
      className="min-h-0 flex-1 overflow-auto"
      ref={ref}
      data-screenshot-root="true"
    >
      {children}
    </div>
  );
}
