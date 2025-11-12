import { useFormContext } from "react-hook-form";

import { format, Locale } from "date-fns";
import { ru, ro } from "date-fns/locale";

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
import { useTheme } from "next-themes";

function DatePickerInput({
  fieldName,
  className,
}: {
  fieldName: string;
  className?: string;
}) {
  const { theme } = useTheme();
  const t = useTranslations("Home");
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
          <FormItem>
            <Popover>
              <PopoverTrigger
                asChild
                className={cn(
                  className,
                  "h-6 border-0 shadow-none text-bl font-bold",
                  theme === "dark" && "text-wh !bg-background"
                )}
              >
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      !field.value && "text-muted-foreground",
                      theme === "dark" && "border-0"
                    )}
                  >
                    {field.value && isClient ? (
                      format(new Date(field.value), "dd. MM. yy", {
                        locale: locales[locale],
                      })
                    ) : (
                      <span>{t("pickADate")}</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="center">
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
