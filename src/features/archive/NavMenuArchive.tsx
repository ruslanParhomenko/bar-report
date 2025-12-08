"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { useAbility } from "@/providers/AbilityProvider";
import { RefreshCcw } from "lucide-react";
import SelectByMonthYear from "@/components/nav-menu-header/SelectByMonthYear";

const navItems = [
  { title: "bar", param: "bar" },
  { title: "cucina", param: "cucina" },
];

export default function NavMenuArchive() {
  const { isAdmin, isManager, isCash } = useAbility();
  const isDisabled = !isAdmin && !isManager && !isCash;

  const router = useRouter();

  const t = useTranslations("Home");

  const [tab, setTab] = useState("");
  const defaultMonth = new Date().getMonth() + 1;

  const defaultYear = new Date().getFullYear().toString();
  const [month, setMoth] = useState(defaultMonth.toString().padStart(2, "0"));
  const [year, setYear] = useState(defaultYear);

  useEffect(() => {
    if (!tab || !month || !year) return;
    router.push(`/archive?tab=${tab}&month=${month}&year=${year}`);
  }, [tab, month, year]);

  const resetParams = () => {
    setTab("");
    setMoth(defaultMonth.toString().padStart(2, "0"));
    setYear(defaultYear);
    router.push("/archive");
  };

  return (
    <div className="md:mt-2 mt-1 md:mb-8 mb-4 sticky top-0 z-10 flex  gap-4 flex-col md:flex-row ">
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value)}
        className="order-1 md:order-0"
      >
        <TabsList className="flex md:gap-2 h-8">
          {navItems.map((page) => (
            <TabsTrigger
              key={page.title}
              value={page.param}
              className={cn("text-nowrap hover:text-bl cursor-pointer")}
              disabled={isDisabled}
            >
              {t(page.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <SelectByMonthYear
        month={month}
        setMonth={setMoth}
        year={year}
        setYear={setYear}
      />
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
