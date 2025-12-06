"use client";

import SelectByMonthYear from "@/components/nav-menu-header/SelectByMonthYear";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { MONTHS, YEAR } from "@/utils/getMonthDays";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const navItems = [
  { title: "details", tab: "details" },
  { title: "general", tab: "general" },
];

export default function NavMenuPenalty() {
  const router = useRouter();

  const t = useTranslations("Home");

  const defaultMonth = new Date().getMonth() + 1;

  const defaultYear = new Date().getFullYear().toString();
  const [month, setMoth] = useState(defaultMonth.toString().padStart(2, "0"));
  const [year, setYear] = useState(defaultYear);
  const [tabs, setTabs] = useState("details");

  useEffect(() => {
    if (!month || !year) return;
    router.push(`/penalty/?month=${month}&year=${year}&tab=${tabs}`);
  }, [month, year, tabs]);
  return (
    <div className="my-2 flex gap-4 justify-end md:justify-start items-center">
      <SelectByMonthYear
        month={month}
        setMonth={setMoth}
        year={year}
        setYear={setYear}
        typeMonth="number"
      />
      <Tabs
        value={tabs}
        onValueChange={(value) => setTabs(value)}
        className="order-1 md:order-0"
      >
        <TabsList className="flex md:gap-2 h-8">
          {navItems.map((page) => (
            <TabsTrigger
              key={page.title}
              value={page.tab}
              className={cn("text-nowrap hover:text-bl cursor-pointer")}
            >
              {t(page.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
