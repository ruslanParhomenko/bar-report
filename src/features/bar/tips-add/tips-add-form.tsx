"use client";

import { useFormContext } from "react-hook-form";
import NumericInput from "@/components/inputs-form/numeric-input";
import SelectField from "@/components/inputs-form/select-input";
import TextInput from "@/components/inputs-form/text-input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TipsAddForm({ tipsArrayByEmployee }: any) {
  const { getValues, setValue, watch } = useFormContext();

  const tipsAddValues = watch("tipsAdd");

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleAddAmount = (index: number) => {
    const value = getValues(`tipsAdd.${index}.tempValue`);
    const typeAmount = getValues(`tipsAdd.${index}.typeAmount`);

    if (!value) return;

    const currentAmount = getValues(`tipsAdd.${index}.amount`) || [];

    const now = new Date();
    const time = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newItem = {
      value,
      time,
      typeAmount,
    };

    setValue(`tipsAdd.${index}.amount`, [...currentAmount, newItem]);

    setValue(`tipsAdd.${index}.tempValue`, "");
  };

  useEffect(() => {
    tipsArrayByEmployee.fields.forEach((_: any, index: number) => {
      const current = getValues(`tipsAdd.${index}.typeAmount`);

      if (!current) {
        setValue(`tipsAdd.${index}.typeAmount`, "mdl");
      }
    });
  }, [tipsArrayByEmployee.fields]);

  return (
    <div className="flex flex-col gap-8 w-full h-full justify-start items-center md:p-4">
      {tipsArrayByEmployee.fields.map((item: any, index: number) => {
        const numericValue = getValues(`tipsAdd.${index}.tempValue`);
        return (
          <div
            key={item.fieldId}
            className={cn(
              "flex gap-12 items-center w-full justify-center",
              focusedIndex === index && "text-green-600",
              numericValue && "text-red-600!",
            )}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleAddAmount(index)}
              className={cn(
                "h-8 w-8",
                numericValue && "bg-blue-600 text-white",
              )}
              disabled={!numericValue}
            >
              {numericValue && <PlusIcon className="font-bold" />}
            </Button>
            <NumericInput
              fieldName={`tipsAdd.${index}.tempValue`}
              className={cn("w-22", !numericValue && "bg-border")}
              onFocus={() => setFocusedIndex(index)}
            />
            <SelectField
              fieldName={`tipsAdd.${index}.typeAmount`}
              className="w-22"
              data={["mdl", "chips"]}
            />

            <TextInput
              fieldName={`tipsAdd.${index}.employeeName`}
              className="w-32 border-0 shadow-none font-bold"
              disabled
            />

            <TextInput
              fieldName={`tipsAdd.${index}.shift`}
              className="w-16 border-0 shadow-none font-bold"
              disabled
            />
          </div>
        );
      })}
    </div>
  );
}
