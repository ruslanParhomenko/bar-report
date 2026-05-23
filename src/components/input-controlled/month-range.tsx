"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/utils/get-month-days";

export type MonthRange = {
  from?: number;
  to?: number;
};

export function MonthPicker({
  value,
  onChange,
  className,
}: {
  value?: MonthRange;
  onChange?: (value?: MonthRange) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (month: number) => {
    if (value?.from === undefined || value?.to !== undefined) {
      onChange?.({ from: month, to: undefined });
      return;
    }

    if (month < value.from) {
      onChange?.({ from: month, to: value.from });
    } else {
      onChange?.({ from: value.from, to: month });
    }

    setOpen(false);
  };

  const label = React.useMemo(() => {
    if (value?.from === undefined) return "Select month";

    const from = MONTHS[value.from];

    if (value.to === undefined) return from;

    const to = MONTHS[value.to];

    if (value.from === value.to) return from;

    return `${from} - ${to}`;
  }, [value]);

  const isActive = (idx: number) => {
    if (!value) return false;

    if (value.from === idx || value.to === idx) return true;

    if (value.from !== undefined && value.to !== undefined) {
      return idx > value.from && idx < value.to;
    }

    return false;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-7 w-60 items-center justify-center gap-4 text-left text-xs font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-60 p-3" align="start">
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((m, idx) => (
              <button
                key={m}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "hover:bg-accent rounded-md border p-2 text-xs transition",
                  isActive(idx) && "bg-primary text-white",
                )}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
