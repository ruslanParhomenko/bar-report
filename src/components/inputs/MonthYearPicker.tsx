"use client";

import { useState, useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export function MonthYearPicker({ name }: { name: string }) {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const currentYear = new Date().getFullYear();

  // --- внутреннее состояние ---
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );

  // --- синхронизация при изменении value (например reset) ---
  useEffect(() => {
    if (!value) {
      setSelectedMonth(null);
      setSelectedYear(currentYear.toString());
      return;
    }

    const [m, y] = value.split("-");
    setSelectedMonth(m || null);
    setSelectedYear(y || currentYear.toString());
  }, [value]);

  // --- обработчики выбора ---
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    onChange(`${month}-${selectedYear}`);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    if (selectedMonth) onChange(`${selectedMonth}-${year}`);
    else onChange("");
  };

  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="flex gap-2">
      {/* Месяц */}
      <Select value={selectedMonth ?? ""} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Год */}
      <Select value={selectedYear} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
