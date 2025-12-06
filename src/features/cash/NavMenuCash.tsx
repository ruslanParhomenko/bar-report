"use client";

import SelectByMonthYear from "@/components/nav-menu-header/SelectByMonthYear";
import { useRouter } from "@/i18n/navigation";
import { MONTHS } from "@/utils/getMonthDays";
import { useEffect, useState } from "react";

export default function NavMenuCash() {
  const router = useRouter();

  const defaultMonth = MONTHS[new Date().getMonth()];
  const defaultYear = new Date().getFullYear().toString();
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  useEffect(() => {
    if (!month || !year) return;
    router.push(`/cash/?month=${month}&year=${year}`);
  }, [month, year]);
  return (
    <div className="my-2 md:mb-6 flex gap-4 justify-end md:justify-start items-center">
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
