"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

type NumericInputProps = {
  fieldName?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;

  value?: string;
  onChange?: (val: string) => void;
};

function NumericInput({
  fieldName,
  id,
  disabled,
  className,
  onFocus,
  onBlur,
  value: externalValue,
  onChange: externalOnChange,
}: NumericInputProps) {
  const { theme } = useTheme();
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderInput = (value: string, onChange: (val: string) => void) => (
    <FormItem>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Input
              id={id}
              value={value ?? ""}
              disabled={disabled}
              onClick={() => setOpen(true)}
              className={cn(
                "h-8 cursor-pointer text-center",
                theme === "dark" ? "bg-transparent!" : "",
                value && "border-0 font-bold shadow-none",
                Number(value) <= 0 ? "text-rd" : "",
                className,
              )}
              onFocus={() => onFocus?.()}
              onBlur={() => onBlur?.()}
              readOnly
            />
          </FormControl>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "bg-bl grid w-50 grid-cols-3 gap-2 border-none p-2",
            theme === "dark" ? "bg-black" : "",
          )}
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
            <Button
              key={num}
              variant="outline"
              className="bg-background h-10 text-xl"
              onClick={() => onChange((value ?? "") + num)}
            >
              {num}
            </Button>
          ))}

          <Button
            variant="outline"
            className="bg-background h-10 text-xl"
            onClick={() => {
              if (!(value ?? "").startsWith("-")) {
                onChange("-" + (value ?? ""));
              }
            }}
          >
            -
          </Button>

          <Button
            variant="outline"
            className="bg-background h-10 text-xl"
            onClick={() => onChange((value ?? "") + "0")}
          >
            0
          </Button>

          <Button
            variant="outline"
            className="bg-background h-10 text-xl"
            onClick={() => {
              if (!(value ?? "").includes(".")) {
                onChange((value ?? "") + ".");
              }
            }}
          >
            .
          </Button>

          <Button
            variant="outline"
            className="text-rd bg-background h-10 text-xl"
            onClick={() => onChange((value ?? "").slice(0, -1))}
          >
            x
          </Button>

          <Button
            variant="outline"
            className="bg-background col-span-2 h-10 text-xl"
            onClick={() => setOpen(false)}
          >
            ok
          </Button>
        </PopoverContent>
      </Popover>
    </FormItem>
  );

  if (externalOnChange) {
    return renderInput(externalValue ?? "", externalOnChange);
  }

  if (!fieldName) {
    throw new Error("NumericInput: fieldName is required when not controlled");
  }

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => renderInput(field.value, field.onChange)}
    />
  );
}

export default NumericInput;
