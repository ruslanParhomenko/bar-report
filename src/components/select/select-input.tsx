"use client";

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
import { useFormContext } from "react-hook-form";
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
        fieldLabel && "grid grid-cols-1 justify-items-start gap-2 pb-2",
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
              "flex w-full justify-start bg-transparent! [&>svg]:hidden",
              className,
              value && "border-0 font-bold shadow-none",
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
