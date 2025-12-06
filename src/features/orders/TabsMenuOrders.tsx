"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useTransition } from "react";
import { useAbility } from "@/providers/AbilityProvider";
import { RefreshCcw } from "lucide-react";

const navItems = [
  { title: "bar", param: "bar" },
  { title: "cucina", param: "cucina" },
];

export default function NavMenuOrders({ mainRoute }: { mainRoute: string }) {
  const key = `tab_${mainRoute}`;
  const { isAdmin, isBar, isCucina } = useAbility();
  const isDisabled = !isAdmin && !isBar && !isCucina;

  const router = useRouter();

  const t = useTranslations("Home");

  const [patchTab, setPatchTab] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setPatchTab(saved);
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(key, patchTab);
    const url = `/${mainRoute}/${patchTab}`;

    startTransition(() => {
      router.push(url);
    });
  }, [patchTab, hydrated]);

  const resetParams = () => {
    setPatchTab("");

    router.push("/reports");
  };

  return (
    <div className="md:mt-2 mt-1 sticky top-0 z-10 flex  gap-4 flex-col md:flex-row border-b pb-3">
      <Tabs
        value={patchTab}
        onValueChange={(value) => setPatchTab(value)}
        className="order-1 md:order-0"
      >
        <TabsList className="flex md:gap-2 h-8">
          {navItems.map((page) => (
            <TabsTrigger
              key={page.title}
              value={page.param}
              className={cn("text-nowrap w-26 hover:text-bl cursor-pointer")}
              disabled={isDisabled || isPending}
            >
              {t(page.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <button
        type="button"
        onClick={() => resetParams()}
        className="px-4 cursor-pointer"
      >
        <RefreshCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
