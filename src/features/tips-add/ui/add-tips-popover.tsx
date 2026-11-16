"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type TipsNumericInputProps = {
  fieldName: string;
  typeFieldName: string;
  onAdd: () => void;
  disabled?: boolean;
  className?: string;
  employeeName: string;
  index: number;
};

function ChipIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

export default function TipsNumericInput({
  employeeName,
  fieldName,
  typeFieldName,
  onAdd,
  disabled,
  className,
  index,
}: TipsNumericInputProps) {
  const { control, setValue } = useFormContext();
  const [open, setOpen] = useState(false);

  const keyClass = "bg-gr h-13 text-xl text-white font-bold";

  const handleAdd = (type: "mdl" | "chips") => {
    setValue(typeFieldName, type, { shouldDirty: true });
    onAdd();
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setValue(fieldName, "", { shouldDirty: true });
  };

  const pos = index + 1;
  const align = pos <= 2 ? "start" : pos <= 5 ? "center" : "end";

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        const v: string = field.value ?? "";
        const onChange = field.onChange;

        return (
          <FormItem>
            <Popover open={open} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={disabled}
                  className={cn(
                    "flex h-8 cursor-pointer justify-between",
                    v && "[&>span]:text-rd!",
                    className,
                  )}
                >
                  <span className="text-bl w-40 truncate text-start text-xs font-bold md:text-sm">
                    {employeeName}
                  </span>
                  <PlusIcon className="text-bl size-3" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                side="right"
                align={align}
                sideOffset={8}
                className="bg-background grid w-90 grid-cols-3 gap-6 p-3 shadow-lg"
              >
                <div
                  className={cn(
                    "col-span-3 flex h-8 items-center justify-around text-xl font-bold",
                    Number(v) <= 0 && "text-rd",
                  )}
                >
                  <span className="text-xs font-normal">{employeeName}:</span>
                  <span> {v || "0"}</span>
                </div>

                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant="outline"
                    className={keyClass}
                    onClick={() => onChange(v + num)}
                  >
                    {num}
                  </Button>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className={keyClass}
                  onClick={() => {
                    if (!v.startsWith("-")) onChange("-" + v);
                  }}
                >
                  -
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={keyClass}
                  onClick={() => onChange(v + "0")}
                >
                  0
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={keyClass}
                  onClick={() => {
                    if (!v.includes(".")) onChange(v + ".");
                  }}
                >
                  .
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className={cn(keyClass, "bg-rd!")}
                  onClick={() =>
                    v ? onChange(v.slice(0, -1)) : handleOpenChange(false)
                  }
                >
                  x
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(keyClass, v && "bg-yl!")}
                  disabled={!v || disabled}
                  onClick={() => handleAdd("mdl")}
                  aria-label="mdl"
                >
                  <span className="text-sm font-bold text-black">M</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(keyClass, v && "bg-gn!")}
                  disabled={!v || disabled}
                  onClick={() => handleAdd("chips")}
                  aria-label="chips"
                >
                  <span className="text-sm font-bold">F</span>
                </Button>
              </PopoverContent>
            </Popover>
          </FormItem>
        );
      }}
    />
  );
}
