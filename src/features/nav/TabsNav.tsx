"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { MONTHS } from "@/utils/getMonthDays";
import SelectScheduleByMonth from "./SelectScheduleByMonth";

export type PageNavType = {
  title: string;
  href: string;
};

interface PageNavProps {
  navItems: PageNavType[];
  mainRoute: string;
}

export default function PageNavTabs({ navItems, mainRoute }: PageNavProps) {
  const router = useRouter();

  const t = useTranslations("Home");
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [patch, setPath] = useState("bar");
  useEffect(() => {
    if (!month || !year || !patch) return;
    router.push(`/${mainRoute}/${patch}?month=${month}&year=${year}`);
  }, [month, year, patch]);

  return (
    <div className="md:mt-2 mt-1 md:mb-8 mb-4 sticky top-0 z-10 flex gap-1 md:gap-4">
      <Tabs
        value={patch}
        onValueChange={(value) => setPath(value)}
        className="order-1 md:order-0"
      >
        <TabsList className="flex md:gap-2 h-8">
          {navItems.map((page) => (
            <TabsTrigger
              key={page.title}
              value={page.href}
              className={cn("text-nowrap hover:text-bl cursor-pointer")}
            >
              {t(page.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <SelectScheduleByMonth
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
      />
    </div>
  );
}
