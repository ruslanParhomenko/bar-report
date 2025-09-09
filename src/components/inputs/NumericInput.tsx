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
import { useState } from "react";

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
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

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
                  placeholder={placeholder}
                  value={value ?? ""}
                  readOnly
                  disabled={disabled}
                  onClick={() => setOpen(true)}
                  className={`cursor-pointer text-center ${className ?? ""}`}
                />
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-2 grid grid-cols-3 gap-2 border-none bg-bl">
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
                className="h-10 text-xl text-rd bg-background"
                onClick={() => onChange((value ?? "").slice(0, -1))}
              >
                X
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
                className="h-10 text-xl col-span-3  bg-background"
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
