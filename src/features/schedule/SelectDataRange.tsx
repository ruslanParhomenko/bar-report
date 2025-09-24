"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  selectMonthBar,
  selectMonthCucina,
  selectMonthDish,
} from "./constants";
import { ScheduleTable } from "./ScheduleTable";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const SELECT_DATA = {
  cucina: selectMonthCucina,
  bar: selectMonthBar,
  dish: selectMonthDish,
};

export const SelectDataRange = () => {
  const { theme } = useTheme();
  const t = useTranslations("Home");
  const pathname = usePathname()?.split("/")[2] || "bar";
  const LOKAL_KEY = `lokal-month-${pathname}`;

  const [dataRange, setDataRange] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LOKAL_KEY) || "1";
    }
    return "1";
  });
  const options = SELECT_DATA[pathname as keyof typeof SELECT_DATA] || [];
  const currentValue =
    options.find((item) => item.value === dataRange)?.value || "";

  const handleChange = (value: string) => {
    const selected = options.find((item) => item.value === value);
    localStorage.setItem(LOKAL_KEY, selected?.value as string);
    if (selected) setDataRange(selected.value);
  };

  return (
    <>
      <div className="md:w-1/5 w-full py-4">
        <Select value={currentValue} onValueChange={handleChange}>
          <SelectTrigger
            className={cn("w-[200px]", theme === "dark" ? "border-0" : "")}
          >
            <SelectValue placeholder={t("selectMonth")} />
          </SelectTrigger>
          <SelectContent>
            {options.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {dataRange === "1" ? (
        <div className="flex items-center justify-center w-full h-full">
          data not found
        </div>
      ) : (
        <ScheduleTable dataRange={dataRange} />
      )}
    </>
  );
};
