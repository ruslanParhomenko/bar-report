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
            <FormItem
              className={`${fieldLabel ? "flex gap-x-4 max-h-6" : ""} ${
                className ?? ""
              }`}
            >
              {fieldLabel && (
                <Label
                  className={`${fieldLabel ? "w-3/4" : ""} ${
                    field.value && field.value !== 0
                      ? "text-blue-600 font-bold"
                      : ""
                  }`}
                >
                  {fieldLabel}
                </Label>
              )}
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled={disabled ?? field.value === "X" ? true : false}
              >
                <FormControl
                  className={` ${fieldLabel ? "max-h-6" : "w-full"}`}
                >
                  <SelectTrigger
                    className={`flex justify-center min-w-12 text-base [&>svg]:hidden ${
                      field.value === "X" ? "bg-gray-600" : ""
                    }`}
                  >
                    <SelectValue placeholder={placeHolder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data?.map((item) => (
                    <SelectItem key={item.label} value={item.label}>
                      {item.value}
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
