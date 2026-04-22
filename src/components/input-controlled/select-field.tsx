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

type Props = {
  fieldName: string;
  fieldLabel?: string;
  placeHolder?: string;
  data: string[];
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
};

export default function SelectField({
  fieldName,
  fieldLabel,
  placeHolder,
  data,
  disabled,
  className,
  onChange,
}: Props) {
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
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "flex justify-start truncate w-full [&>svg]:hidden bg-transparent!",
                  className,
                  field.value && "border-0 shadow-none font-bold",
                )}
              >
                <span className="truncate block">
                  <SelectValue placeholder={placeHolder} />
                </span>
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {data.map((item, index) => (
                <SelectItem key={`${item}-${index}`} value={item}>
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
