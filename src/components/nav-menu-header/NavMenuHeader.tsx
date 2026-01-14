"use client";
import { MONTHS } from "@/utils/getMonthDays";
import { useEffect, useState, useTransition } from "react";
import SelectTabsByPatch from "./SelectTabsByPatch";
import SelectByMonthYear from "./SelectByMonthYear";
import { usePathname, useRouter } from "next/navigation";
import SelectEmployeeBy from "@/features/employees/SelectEmployeeBy";
import { RefreshCcw } from "lucide-react";
import { NAV_BY_PATCH } from "./constants";
import { set } from "zod";

export default function NavMenuHeader() {
  const mainRoute = usePathname().split("/")[1];
  const filterType =
    NAV_BY_PATCH[mainRoute as keyof typeof NAV_BY_PATCH]?.filterType;

  const navItems =
    NAV_BY_PATCH[mainRoute as keyof typeof NAV_BY_PATCH]?.navItems;

  const router = useRouter();

  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [patch, setPatch] = useState<string>("");

  const [role, setRole] = useState("waiters");

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!navItems || navItems.length === 0) {
      setPatch("");
      return;
    }

    setPatch(navItems[0].href);
  }, [navItems]);

  useEffect(() => {
    const url =
      filterType === "role"
        ? `/${mainRoute}/${patch}?role=${role}`
        : filterType === "month"
        ? `/${mainRoute}/${patch}?month=${month}&year=${year}`
        : `/${mainRoute}/${patch}`;

    startTransition(() => {
      router.push(url);
    });
  }, [patch, month, year, role, filterType, mainRoute, router]);

  const resetParams = () => {
    setPatch("");

    router.push(`/${mainRoute}`);
  };
  return (
    <div className="md:py-2 mt-1 mb-1 sticky top-0 z-9 flex justify-center md:justify-start md:gap-4 gap-1.5 bg-background">
      {navItems?.length > 0 && (
        <SelectTabsByPatch
          patch={navItems.length > 0 ? patch : ""}
          setPatch={setPatch}
          isPending={isPending}
          navItems={navItems}
        />
      )}
      {filterType === "month" && (
        <SelectByMonthYear
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
          isLoading={isPending}
          classNameMonthYear={navItems.length > 0 ? "w-15" : "w-24"}
        />
      )}
      {filterType === "role" && (
        <SelectEmployeeBy role={role} setRole={setRole} />
      )}

      <button
        onClick={resetParams}
        className="hover:text-black text-bl hover:bg-transparent cursor-pointer md:w-24 md:order-3 order-0 px-2"
      >
        <RefreshCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
