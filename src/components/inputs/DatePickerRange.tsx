"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format, Locale } from "date-fns";
import { ru, ro } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateRangeProps = {
  onDataChange?: (date: DateRange | undefined) => void;
  resetTrigger?: boolean;
  className?:string
};

type stepType = "from" | "to";

export const DatePickerRange = ({
  onDataChange,
  resetTrigger,
  className
}: DateRangeProps) => {
  const tDate = useTranslations("Home");
  const locale = useLocale();
  const locales: Record<string, Locale> = {
    ru: ru,
    ro: ro
  };
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState<stepType>("from");

  const handleSelect = (date: Date | undefined) => {
    if (step === "from") {
      setFrom(date);
      setTo(undefined);
      setStep("to");
    } else if (step === "to") {
      if (from && date && date >= from) {
        setTo(date);
        setStep("from");

        onDataChange?.({ from, to: date });
        setOpen(false);
      } else {
        setTo(undefined);
      }
    }
  };

  const displayText =
    from && to
      ? `${format(from, "dd. MM.  y", { locale: locales[locale] })} - ${format(
          to,
          "dd. MM. y",
          { locale: locales[locale] }
        )}`
      : from
      ? `${format(from, "dd. MM. y", { locale: locales[locale] })} →`
      : tDate("pickADate");

  useEffect(() => {
    setFrom(undefined);
    setTo(undefined);
    setStep("from");
  }, [resetTrigger]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(className)}>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "pl-3 text-left font-normal",
            !from && "text-muted-foreground"
          )}
        >
          <span>{displayText}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent  align="start">
        <Calendar
          mode="single"
          selected={step === "from" ? from : to}
          onSelect={handleSelect}
          defaultMonth={from || new Date()}
          locale={locales[locale]}
        />
      </PopoverContent>
    </Popover>
  );
};
