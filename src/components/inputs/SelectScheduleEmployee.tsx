"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type Props = {
  fieldName: string;
  placeHolder?: string;
  data: any[];
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function SelectScheduleEmployee({
  fieldName,
  placeHolder,
  data,
  disabled,
  className,
  style,
}: Props) {
  const { theme } = useTheme();
  const { control } = useFormContext();

  const options = data?.map((item) => ({ label: item.name, value: item.name }));

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field, fieldState }) => (
        <FormField
          control={control}
          name={fieldName}
          render={() => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={disabled}
              >
                <FormControl className="w-full">
                  <SelectTrigger
                    data-placeholder=""
                    className={cn(
                      "flex justify-center min-w-8 [&>svg]:hidden border-0 shadow-none",
                      className,
                      theme === "dark" ? "border-0 bg-transparent!" : ""
                    )}
                    style={style}
                  >
                    <SelectValue placeholder={placeHolder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((item, index) => (
                    <SelectItem
                      key={`${item.value}-${index}`}
                      value={item.value}
                      className="cursor-pointer"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>{fieldState?.error?.message}</FormMessage>
            </FormItem>
          )}
        />
      )}
    />
  );
}
