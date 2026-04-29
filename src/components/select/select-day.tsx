"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Select, SelectContent, SelectTrigger } from "../ui/select";

export default function SelectDay({
  value,
  onChange,
  monthDays,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  monthDays: { day: number; weekday: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Select open={open} onOpenChange={setOpen}>
      <SelectTrigger
        className={cn(
          "bg-background! h-6! w-full justify-center border-0 text-xs shadow-none [&>svg]:hidden",
          className,
        )}
      >
        {value}
      </SelectTrigger>

      <SelectContent position="popper" className="p-1">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: monthDays.length + 1 }, (_, i) => {
            const day = i;
            const isSelected = day === Number(value);

            return (
              <button
                key={day}
                onClick={() => {
                  onChange(day.toString());
                  setOpen(false);
                }}
                type="button"
                value={String(day)}
                className={cn(
                  "h-6 w-6 rounded-md text-sm transition",

                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </SelectContent>
    </Select>
  );
}
