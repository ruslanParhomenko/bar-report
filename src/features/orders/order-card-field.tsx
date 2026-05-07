"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFormContext, useWatch } from "react-hook-form";

const OTHER_CATEGORY = "OTHER";

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
  const isOther = category === OTHER_CATEGORY;

  // имя кастомного поля хранится в форме
  const nameFieldKey = `${category}.__name_${index}_`;
  const { setValue, control, register } = useFormContext();

  const customName = useWatch({ control, name: nameFieldKey }) ?? "";
  const fieldName = isOther
    ? `${category}.${customName || `custom_${index}`}`
    : `${category}.${item}`;

  const value = useWatch({ control, name: fieldName });

  return (
    <div>
      <div className="grid grid-cols-[80%_8%]">
        {isOther ? (
          <input
            type="text"
            data-slot="input"
            placeholder="название..."
            className={`text-muted-foreground w-40 pl-1 text-sm ${value ? "text-rd" : ""}`}
            {...register(nameFieldKey)}
          />
        ) : (
          <Label
            className={`text-muted-foreground cursor-pointer pl-1 text-xs ${value ? "text-rd text-sm" : ""}`}
            onClick={() => setValue(fieldName, "")}
          >
            {item}
          </Label>
        )}
        <NumericInput fieldName={fieldName} className="h-6! w-9! text-center" />
      </div>
      {!isLast && <Separator className="my-1" />}
    </div>
  );
}
