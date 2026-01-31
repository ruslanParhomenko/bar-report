import { useFormContext } from "react-hook-form";
import { format, Locale } from "date-fns";
import { ru, ro } from "date-fns/locale";
import { useLocale } from "next-intl";
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

import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";

function DatePickerInput({
  fieldName,
  fieldLabel,
  className,
  disabled = false,
}: {
  fieldName: string;
  fieldLabel?: string;
  className?: string;
  disabled?: boolean;
}) {
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
          <FormItem
            className={cn(
              fieldLabel && "grid gap-2 pb-2 grid-cols-1 justify-items-start",
            )}
          >
            {fieldLabel && <Label>{fieldLabel}</Label>}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    disabled={disabled}
                    variant={"outline"}
                    className={cn(
                      "text-base border-0 shadow-none bg-transparent!",
                      className,
                    )}
                  >
                    {field.value &&
                      isClient &&
                      format(new Date(field.value), "dd. MM. yy", {
                        locale: locales[locale],
                      })}
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
