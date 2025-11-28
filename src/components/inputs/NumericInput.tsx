"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type NumericInputProps = {
  fieldName: string;
  id?: string;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

function NumericInput({
  fieldName,
  id,
  placeholder,
  readonly,
  disabled,
  className,
}: NumericInputProps) {
  const { theme } = useTheme();
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Input
                  id={id}
                  value={value ? value : placeholder ?? ""}
                  disabled={disabled}
                  onClick={() => setOpen(true)}
                  className={cn(
                    "cursor-pointer text-center h-8",
                    theme === "dark" ? "border-0" : "",
                    value && "border-0 shadow-none text-black! font-bold",
                    Number(value) <= 0 ? "text-rd " : "",
                    className
                  )}
                />
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className={cn(
                "w-50 p-2 grid grid-cols-3 gap-2 border-none bg-bl",
                theme === "dark" ? "bg-black" : ""
              )}
            >
              {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-10 text-xl bg-background"
                  onClick={() => onChange((value ?? "") + num)}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-10 text-xl   bg-background"
                onClick={() => {
                  if (!(value ?? "").includes(".")) {
                    onChange("-" + (value ?? ""));
                  }
                }}
              >
                -
              </Button>

              <Button
                variant="outline"
                className="h-10 text-xl bg-background"
                onClick={() => onChange((value ?? "") + "0")}
              >
                0
              </Button>
              <Button
                variant="outline"
                className="h-10 text-xl bg-background"
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
                className="h-10 text-xl text-rd bg-background"
                onClick={() => onChange((value ?? "").slice(0, -1))}
              >
                x
              </Button>

              <Button
                variant="outline"
                className="h-10 text-xl col-span-2  bg-background"
                onClick={() => setOpen(false)}
              >
                ok
              </Button>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default NumericInput;
