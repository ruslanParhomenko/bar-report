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

export function YearPicker({ name }: { name: string }) {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const currentYear = new Date().getFullYear();

  // --- внутреннее состояние ---
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );

  useEffect(() => {
    if (!value) {
      setSelectedYear(currentYear.toString());
      return;
    }
  }, [value]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="flex gap-2">
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
