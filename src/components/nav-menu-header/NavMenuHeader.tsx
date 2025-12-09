"use client";
import { MONTHS } from "@/utils/getMonthDays";
import { useEffect, useState, useTransition } from "react";
import SelectTabsByPatch from "./SelectTabsByPatch";
import SelectByMonthYear from "./SelectByMonthYear";
import { useRouter } from "next/navigation";
import SelectEmployeeBy from "@/features/employees/SelectEmployeeBy";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

export type PageNavType = {
  title: string;
  href: string;
};

export default function NavMenuHeader({
  navItems,
  mainRoute,
  filterType,
  resetButton = false,
  defaultPatch = "",
  classNamePatch,
}: {
  navItems: PageNavType[];
  mainRoute: string;
  filterType: "month" | "role" | "none";
  resetButton?: boolean;
  defaultPatch?: string;
  classNamePatch?: string;
}) {
  const key = `patch_${mainRoute}`;
  const router = useRouter();

  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [patch, setPatch] = useState(defaultPatch);

  const [role, setRole] = useState("waiters");

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

    const url = `/${mainRoute}/${patch}?month=${month}&year=${year}&role=${role}`;

    startTransition(() => {
      router.push(url);
    });
  }, [patch, month, year, role, hydrated]);

  const resetParams = () => {
    setPatch("");

    router.push(`/${mainRoute}`);
  };
  return (
    <div className="md:mt-2 mt-1 mb-4 sticky top-0 z-9 flex justify-end md:justify-start md:gap-4 gap-2">
      {navItems.length > 0 && (
        <SelectTabsByPatch
          patch={patch}
          setPatch={setPatch}
          isPending={isPending}
          navItems={navItems}
          classNamePatch={classNamePatch}
        />
      )}
      {filterType === "month" && (
        <SelectByMonthYear
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
          isLoading={isPending}
        />
      )}
      {filterType === "role" && (
        <SelectEmployeeBy role={role} setRole={setRole} />
      )}
      {resetButton && (
        <Button
          variant={"default"}
          onClick={resetParams}
          className="bg-gr/50 hover:text-bl hover:bg-transparent h-7.5 py-0 cursor-pointer md:w-24"
        >
          <RefreshCcw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
