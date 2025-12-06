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
import SelectByMonthYear from "@/components/nav-menu-header/SelectByMonthYear";

const navItems = [
  { title: "barmen", param: "barmen" },
  { title: "waiters", param: "waiters" },
  { title: "cucina", param: "cucina" },
  { title: "dish", param: "dish" },
];

export default function NavMenuResult() {
  const { isAdmin, isManager, isCash } = useAbility();
  const isDisabled = !isAdmin && !isManager && !isCash;

  const router = useRouter();

  const t = useTranslations("Home");

  const defaultMonth = MONTHS[new Date().getMonth() - 1];
  const defaultYear = new Date().getFullYear().toString();
  const [role, setRole] = useState("");
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  useEffect(() => {
    if (!role || !month || !year) return;
    router.push(`/result/?role=${role}&month=${month}&year=${year}`);
  }, [role, month, year]);

  return (
    <div className="md:mt-2 mt-1 md:mb-8 mb-4 sticky top-0 z-10 flex  gap-4 flex-col md:flex-row ">
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
              disabled={isDisabled}
            >
              {t(page.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <SelectByMonthYear
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
        typeMonth="string"
      />
    </div>
  );
}
