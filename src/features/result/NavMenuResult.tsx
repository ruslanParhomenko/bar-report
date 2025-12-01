"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { MONTHS, YEAR } from "@/utils/getMonthDays";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navItems = [
  { title: "waiters", param: "waiters" },
  { title: "barmen", param: "barmen" },
  { title: "cook", param: "cook" },
  { title: "dish", param: "dish" },
];

export default function NavMenuResult() {
  const router = useRouter();

  const t = useTranslations("Home");

  const defaultMonth = MONTHS[new Date().getMonth()];
  const defaultYear = new Date().getFullYear().toString();
  const [role, setRole] = useState("");
  const [month, setMoth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  useEffect(() => {
    if (!role || !month || !year) return;
    router.push(`/result/?role=${role}&month=${month}&year=${year}`);
  }, [role, month, year]);

  return (
    <div className="md:mt-2 mt-1 md:mb-8 mb-4 sticky top-0 z-10 flex gap-1 md:gap-4">
      <Tabs
        value={role}
        onValueChange={(value) => setRole(value)}
        className="order-1 md:order-0"
      >
        <TabsList className="flex md:gap-2 h-8">
          {navItems.map((page) => (
            <TabsTrigger
              key={page.title}
              value={page.param}
              className={cn("text-nowrap hover:text-bl cursor-pointer")}
            >
              {t(page.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Select value={month} onValueChange={(value) => setMoth(value)}>
        <SelectTrigger className="w-20 h-7! p-1 bg-border/30 border-0 text-muted-foreground [&>svg]:hidden justify-center">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="all">{t("all")}</SelectItem> */}
          {MONTHS.map((month, idx) => (
            <SelectItem key={`${month}-${idx}`} value={month}>
              {t(month)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={year} onValueChange={(value) => setYear(value)}>
        <SelectTrigger className="w-20 h-7! p-1 bg-border/30 border-0 text-muted-foreground [&>svg]:hidden justify-center">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="all">{t("all")}</SelectItem> */}
          {YEAR.map((year, idx) => (
            <SelectItem key={`${year}-${idx}`} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
