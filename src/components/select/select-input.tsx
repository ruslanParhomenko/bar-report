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
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export type OptionSelect = {
  value: string;
  label: string;
};

type Props = {
  fieldName?: string;
  fieldLabel?: string;
  placeHolder?: string;
  options: OptionSelect[];
  disabled?: boolean;
  className?: string;

  // 👇 added controlled mode
  value?: string;
  onChange?: (value: string) => void;
};

export default function SelectInput({
  fieldName,
  fieldLabel,
  placeHolder,
  options,
  disabled,
  className,
  value: externalValue,
  onChange: externalOnChange,
}: Props) {
  const { control } = useFormContext();

  const renderSelect = (value: string, onChange: (val: string) => void) => (
    <FormItem
      className={cn(
        fieldLabel && "grid gap-2 pb-2 grid-cols-1 justify-items-start",
      )}
    >
      {fieldLabel && <Label>{fieldLabel}</Label>}

      <Select
        value={value ?? ""}
        onValueChange={(val) => onChange(val)}
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger
            className={cn(
              "flex justify-start min-w-12 [&>svg]:hidden bg-transparent!",
              className,
              value && "border-0 shadow-none font-bold",
            )}
          >
            <SelectValue placeholder={placeHolder} />
          </SelectTrigger>
        </FormControl>

        <SelectContent>
          {options.map((item, index) => (
            <SelectItem key={`${item.value}-${index}`} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <FormMessage />
    </FormItem>
  );

  // ===== controlled mode (like NumericInput) =====
  if (externalOnChange) {
    return renderSelect(externalValue ?? "", externalOnChange);
  }

  // ===== RHF mode =====
  if (!fieldName) {
    throw new Error("SelectInput: fieldName is required when not controlled");
  }

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => renderSelect(field.value ?? "", field.onChange)}
    />
  );
}
