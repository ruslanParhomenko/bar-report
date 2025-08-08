import { useFormContext } from "react-hook-form";

import { format, Locale } from "date-fns";
import { ru, ro } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import React, { useState, useEffect } from "react";
// ...остальные импорты

function DatePickerInput({ fieldName }: { fieldName: string }) {
  const tDate = useTranslations("Date");
  const locale = useLocale();
  const locales: Record<string, Locale> = {
    ru,
    ro,
  };
  const { control } = useFormContext();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className="w-3xs">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl className="w-full">
                  <Button
                    variant={"outline"}
                    className={cn(
                      "p-4 text-center font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value && isClient ? (
                      format(new Date(field.value), "LLL dd,   y", {
                        locale: locales[locale],
                      })
                    ) : (
                      <span>{tDate("pickADate")}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-8 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-3xs p-2 " align="center">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  weekStartsOn={1}
                  locale={locales[locale]}
                />
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
export default DatePickerInput;
