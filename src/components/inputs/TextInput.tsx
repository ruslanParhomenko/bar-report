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
  multiline?: boolean | undefined;
  rows?: number | undefined;
  minRows?: number | undefined;
  maxRows?: number | undefined;
  type?: string;
  withButton?: React.ReactNode;
  className?: string;
};

function TextInput({
  fieldName,
  fieldLabel,
  placeholder,
  type,
  withButton,
  className,
}: TextInputProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={fieldName}
      defaultValue={""}
      render={({ field }) => {
        return (
          <FormItem className="grid grid-cols-1 place-items-start justify-items-start gap-1 ">
            {fieldLabel && (
              <Label className="text-nowrap text-[16px] font-semibold lg:pr-14">
                {fieldLabel}
              </Label>
            )}

            <div className="w-full">
              <div className="flex gap-2">
                <FormControl className={cn("w-full ", className)}>
                  <Input placeholder={placeholder} type={type} {...field} />
                </FormControl>

                {withButton}
              </div>
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
}
export default TextInput;
