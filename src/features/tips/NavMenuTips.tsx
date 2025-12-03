"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { MONTHS, YEAR } from "@/utils/getMonthDays";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function NavMenuTips() {
  const router = useRouter();

  const t = useTranslations("Home");

  const defaultMonth = MONTHS[new Date().getMonth()];
  const defaultYear = new Date().getFullYear().toString();
  const [month, setMoth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  useEffect(() => {
    if (!month || !year) return;
    router.push(`/tips/?month=${month}&year=${year}`);
  }, [month, year]);
  return (
    <div className="my-2  flex gap-4 justify-end md:justify-start items-center">
      <Select value={month} onValueChange={(value) => setMoth(value)}>
        <SelectTrigger className="w-22 h-7! p-1 bg-border/30 border-0 text-muted-foreground [&>svg]:hidden justify-center">
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
        <SelectTrigger className="w-22 h-7! p-1 bg-border/30 border-0 text-muted-foreground [&>svg]:hidden justify-center">
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
