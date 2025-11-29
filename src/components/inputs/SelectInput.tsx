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

import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type Props = {
  fieldName: string;
  fieldLabel?: string;
  placeHolder?: string;
  data: { label: string; value: string }[];
  disabled?: boolean;
  className?: string;
};

function SelectInput({
  fieldName,
  placeHolder,
  data,
  disabled,
  fieldLabel,
  className,
}: Props) {
  const { control, watch } = useFormContext();

  watch();
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormField
          control={control}
          name={fieldName}
          render={() => (
            <FormItem className="grid gap-4 pb-2">
              {fieldLabel && <Label className={className}>{fieldLabel}</Label>}
              <Select
                onValueChange={field.onChange}
                key={field.value}
                value={field.value ?? ""}
                disabled={disabled}
              >
                <FormControl className={cn("w-full", className)}>
                  <SelectTrigger className="flex justify-between">
                    <SelectValue placeholder={placeHolder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data?.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    />
  );
}

export default SelectInput;
