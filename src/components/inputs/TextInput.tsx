"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type TextInputProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  placeholder?: string | undefined;
  type?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
};

function TextInput({
  fieldName,
  fieldLabel,
  placeholder,
  type,
  className,
  orientation = "vertical",
  disabled = false,
}: TextInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={fieldName}
      defaultValue={""}
      render={({ field }) => {
        return (
          <FormItem
            className={cn(
              "grid gap-2 pb-2",
              orientation === "vertical"
                ? "grid-cols-1 justify-items-start"
                : "grid-cols-2 justify-items-start"
            )}
          >
            {fieldLabel && <Label className={className}>{fieldLabel}</Label>}

            <FormControl className={cn("w-full", className)}>
              <Input
                placeholder={placeholder}
                type={type}
                {...field}
                disabled={disabled}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
export default TextInput;
