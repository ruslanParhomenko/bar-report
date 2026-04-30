"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export default function OrderCardField({
  item,
  isLast,
  category,
  index,
}: {
  item: string;
  isLast: boolean;
  category: string;
  index: number;
}) {
  const [customName, setCustomName] = useState("");

  const fieldName = item
    ? `${category}.${item}`
    : `${category}.${customName || `custom_${index}`}`;

  const { setValue, control } = useFormContext();
  const value = useWatch({ control, name: fieldName });

  return (
    <div>
      <div className="grid grid-cols-[80%_8%]">
        {item ? (
          <Label
            className={`text-muted-foreground cursor-pointer pl-1 text-sm ${value ? "text-rd" : ""}`}
            onClick={() => setValue(fieldName, "")}
          >
            {item}
          </Label>
        ) : (
          <input
            type="text"
            data-slot="input"
            placeholder="название..."
            className={`text-muted-foreground w-40 pl-1 text-sm ${value ? "text-rd" : ""}`}
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onClick={() => setValue(fieldName, "")}
          />
        )}
        <NumericInput
          fieldName={fieldName}
          className="h-6.5! w-9! text-center"
        />
      </div>
      {!isLast && <Separator className="my-1" />}
    </div>
  );
}
