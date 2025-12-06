"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { MONTHS } from "@/utils/getMonthDays";
import SelectByMonthYear from "@/components/nav-menu-header/SelectByMonthYear";
import SelectTabsByPatch, {
  PageNavType,
} from "@/components/nav-menu-header/SelectTabsByPatch";

interface PageNavProps {
  navItems: PageNavType[];
  mainRoute: string;
}

export default function TabsNavSchedule({ navItems, mainRoute }: PageNavProps) {
  const key = `patch_${mainRoute}`;
  const router = useRouter();

  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [patch, setPatch] = useState("");

  const [hydrated, setHydrated] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setPatch(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(key, patch);

    const url = `/${mainRoute}/${patch}?month=${month}&year=${year}`;

    startTransition(() => {
      router.push(url);
    });
  }, [patch, month, year, hydrated]);

  return (
    <div className="md:mt-2 mt-1 md:mb-8 mb-4 sticky top-0 z-10 flex gap-1 md:gap-4">
      <SelectTabsByPatch
        patch={patch}
        setPatch={setPatch}
        isPending={isPending}
        navItems={navItems}
      />
      <SelectByMonthYear
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
        isLoading={isPending}
        typeMonth="string"
      />
    </div>
  );
}
