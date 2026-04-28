import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";
import { format, Locale } from "date-fns";
import { ro, ru } from "date-fns/locale";
import { useLocale } from "next-intl";
import { useFormContext } from "react-hook-form";

import { useEffect, useState } from "react";
import { Label } from "../ui/label";

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
              fieldLabel && "grid grid-cols-1 justify-items-start gap-2 pb-2",
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
                      "border-0 bg-transparent! text-base shadow-none",
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
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date ? date.toISOString() : null);
                  }}
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
