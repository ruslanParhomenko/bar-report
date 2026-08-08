"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
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

  const isMobile = useIsMobile();

  const nameFieldKey = `${category}.__name_${index}_`;
  const { setValue, control, register } = useFormContext();

  const customName = useWatch({ control, name: nameFieldKey }) ?? "";
  const fieldName = isOther
    ? `${category}.${customName || `custom_${index}`}`
    : `${category}.${item}`;

  const value = useWatch({ control, name: fieldName });

  const weekday = new Date().getDay();
  const dayKey = `${fieldName}__day`;

  const savedDay = useWatch({ control, name: dayKey });

  useEffect(() => {
    if (value && savedDay === undefined) {
      setValue(dayKey, weekday, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [value]);

  const DAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

  const dayLabel = savedDay != null ? DAYS[savedDay] : "";

  return (
    <div>
      <div className="grid grid-cols-[72%_10%_10%]">
        {isOther ? (
          <input
            type="text"
            data-slot="input"
            placeholder="название..."
            className={`text-muted-foreground w-36 pl-1 text-sm ${value ? "text-rd" : ""}`}
            {...register(nameFieldKey)}
          />
        ) : (
          <Label
            className={cn(
              "text-muted-foreground cursor-pointer pl-1",
              !isMobile && "text-xs",
              value ? "text-rd text-sm" : "",
            )}
            onClick={() => setValue(fieldName, "")}
          >
            {item}
          </Label>
        )}
        <NumericInput fieldName={fieldName} className="flex h-6! w-9! p-0!" />
        <div className="flex h-6 w-8 items-center justify-center p-0 text-xs">
          {value ? dayLabel : ""}
        </div>
      </div>
      {!isLast && <Separator className="my-1" />}
    </div>
  );
}
