"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function NavTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const NAV_ITEMS_BY_PATCH = {
    bar: [
      { label: "report", value: "report" },
      { label: "break", value: "break" },
      { label: "penalty", value: "penalty" },
    ],
  };

  const navItems =
    NAV_ITEMS_BY_PATCH[
      pathname.split("/")[1] as keyof typeof NAV_ITEMS_BY_PATCH
    ];

  const tabFromUrl = searchParams.get("tab");

  const isValidTab = navItems.some((item) => item.value === tabFromUrl);

  const defaultTab = navItems[0].value;
  const currentTab = isValidTab ? tabFromUrl! : defaultTab;

  // 🔥 если tab нет или он невалидный → ставим default в URL
  useEffect(() => {
    if (!tabFromUrl || !isValidTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", defaultTab);

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [tabFromUrl, isValidTab, defaultTab, pathname, router, searchParams]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="flex flex-col   my-2 px-4">
        <TabsList className="flex md:gap-2 h-8 w-80">
          {navItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="hover:text-bl cursor-pointer w-1/3"
            >
              <span className="truncate block w-full text-xs md:text-md text-bl">
                {item.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
