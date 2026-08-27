"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";

export default function OrderCardField({
  item,
  isLast,
  category,
}: {
  item: string;
  isLast: boolean;
  category: string;
}) {
  const { setValue, control } = useFormContext();

  const fieldName = `${category}.${item}`;

  const value = useWatch({ control, name: fieldName });

  return (
    <div>
      <div className="grid grid-cols-[78%_22%]">
        <Label
          className={cn(
            "text-muted-foreground cursor-pointer pl-1",

            value ? "text-rd" : "",
          )}
          onClick={() => setValue(fieldName, "")}
        >
          {item}
        </Label>
        <div className="flex items-center justify-end pr-1">
          <NumericInput fieldName={fieldName} className="flex h-6! w-9! p-0!" />
        </div>
      </div>
      {!isLast && <Separator className="my-1" />}
    </div>
  );
}
