"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
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

export default function SelectWithInput({
  fieldName,
  placeHolder,
  data,
  disabled,
  className,
  style,
}: Props) {
  const { theme } = useTheme();
  const { control } = useFormContext();
  const [customValue, setCustomValue] = useState("");
  const [isCustom, setIsCustom] = useState(false);

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
              {!isCustom ? (
                <Select
                  onValueChange={(val) => {
                    if (val === "__custom__") {
                      setIsCustom(true);
                      field.onChange("");
                    } else {
                      field.onChange(val);
                    }
                  }}
                  value={field.value}
                  disabled={disabled}
                >
                  <FormControl className="w-full">
                    <SelectTrigger
                      data-placeholder=""
                      className={cn(
                        "flex justify-center min-w-12 [&>svg]:hidden",
                        className,
                        theme === "dark" ? "border-0" : ""
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
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom__">
                      ➕ Добавить свой вариант
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2 items-center">
                  <Input
                    value={customValue}
                    onChange={(e) => {
                      setCustomValue(e.target.value);
                      field.onChange(e.target.value);
                    }}
                    placeholder="Введите свой вариант..."
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustom(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    отмена
                  </button>
                </div>
              )}

              <FormMessage>{fieldState?.error?.message}</FormMessage>
            </FormItem>
          )}
        />
      )}
    />
  );
}
