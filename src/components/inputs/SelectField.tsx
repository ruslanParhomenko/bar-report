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
  data: string[];
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function SelectField({
  fieldName,
  placeHolder,
  data,
  disabled,
  className,
  style,
}: Props) {
  const { theme } = useTheme();
  const { control } = useFormContext();

  const options = data?.map((item) => ({ label: item, value: item }));

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
                      "flex justify-start min-w-12 [&>svg]:hidden !h-8",
                      className,
                      theme === "dark" ? "border-0 !bg-background" : ""
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

export default SelectField;
