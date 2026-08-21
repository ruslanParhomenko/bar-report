"use client";

import { NAV_BY_PATCH } from "@/components/home-layout/header-bar/constants";
import NavTabs from "@/components/nav-tabs/nav-tabs";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function SelectTabs({ urlTab }: { urlTab: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const mainRoute = pathname.split("/")[1];

  const config = NAV_BY_PATCH[mainRoute as keyof typeof NAV_BY_PATCH];
  const navItems = config?.tabs ?? [];

  const storageKey = `nav-tab-${pathname}`;

  useEffect(() => {
    if (!urlTab) return;

    const saved = localStorage.getItem(storageKey);

    if (!saved) return;

    if (urlTab === saved) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", saved);

    startTransition(() => {
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    });
  }, [pathname, storageKey, urlTab]);

  const handleTabChange = (value: string) => {
    localStorage.setItem(storageKey, value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  if (!urlTab) return null;

  return (
    <NavTabs
      navItems={navItems}
      activeTab={urlTab}
      handleTabChange={handleTabChange}
      disabled={isPending}
    />
  );
}
