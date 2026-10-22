"use client";

import AppTooltip from "@/components/ui/app-tooltip";
import { cn } from "@/lib/utils";
import { CalendarPlus2 } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
    <Popover open={open} onOpenChange={setOpen}>
      <AppTooltip content="выберите день">
        <PopoverTrigger
          className={cn(
            "bg-background flex h-6 w-18 items-center justify-center text-xs",
            className,
          )}
        >
          {value ? value : <CalendarPlus2 className="text-rd size-3.5" />}
        </PopoverTrigger>
      </AppTooltip>

      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-6 gap-2">
          {monthDays.map(({ day }) => (
            <button
              key={day}
              type="button"
              onClick={() => {
                onChange(String(day));
                setOpen(false);
              }}
              className={cn(
                "h-6 w-6 rounded-md text-sm transition",
                day === Number(value)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
