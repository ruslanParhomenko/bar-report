"use client";

import { useFormContext } from "react-hook-form";
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
import { Label } from "../ui/label";

type Props = {
  fieldName: string;
  fieldLabel?: string;
  placeHolder?: string;
  data: string[];
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function SelectField({
  fieldName,
  fieldLabel,
  placeHolder,
  data,
  disabled,
  className,
  style,
}: Props) {
  const { theme } = useTheme();
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            fieldLabel && "grid gap-2 pb-2 grid-cols-1 justify-items-start",
          )}
        >
          {fieldLabel && <Label>{fieldLabel}</Label>}
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "flex justify-start min-w-12 [&>svg]:hidden",
                  className,
                  theme === "dark" ? "border-0 bg-background!" : "",
                  field.value && "border-0 shadow-none font-bold",
                )}
                style={style}
              >
                <SelectValue placeholder={placeHolder} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {data.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}

export default SelectField;
