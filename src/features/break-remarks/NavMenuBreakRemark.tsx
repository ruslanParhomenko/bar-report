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
import { useAbility } from "@/providers/AbilityProvider";

const navItems = [
  { title: "form", param: "form" },
  { title: "archive", param: "archive" },
];

export default function NavMenuBreakRemark() {
  const { isAdmin, isManager, isCash } = useAbility();
  const isDisabled = !isAdmin && !isManager && !isCash;

  const router = useRouter();

  const t = useTranslations("Home");

  const [isViewSelect, setIsViewSelect] = useState(false);
  const [tab, setTab] = useState("form");
  const defaultMonth = new Date().getMonth() + 1;

  const defaultYear = new Date().getFullYear().toString();
  const [month, setMoth] = useState(defaultMonth.toString().padStart(2, "0"));
  const [year, setYear] = useState(defaultYear);

  useEffect(() => {
    if (!tab || !month || !year) return;
    router.push(`/break-remarks/${tab}?month=${month}&year=${year}`);
    if (tab === "archive") {
      setIsViewSelect(true);
    } else {
      setIsViewSelect(false);
    }
  }, [tab, month, year]);

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
      {isViewSelect && (
        <div className="flex gap-2 justify-end md:justify-start items-center">
          <Select
            value={MONTHS[Number(month) - 1]}
            onValueChange={(value) =>
              setMoth(
                (MONTHS.indexOf(value as string) + 1)
                  .toString()
                  .padStart(2, "0")
              )
            }
          >
            <SelectTrigger className="w-20 h-7! p-1 bg-border/30 border-0 text-muted-foreground [&>svg]:hidden justify-center">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
              {YEAR.map((year, idx) => (
                <SelectItem key={`${year}-${idx}`} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
