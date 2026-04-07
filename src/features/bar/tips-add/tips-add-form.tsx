"use client";

import { useFormContext, useWatch } from "react-hook-form";
import NumericInput from "@/components/inputs-form/numeric-input";
import SelectField from "@/components/inputs-form/select-input";
import TextInput from "@/components/inputs-form/text-input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createDefaultTipsAdd } from "./schema";

export default function TipsAddForm({
  tipsArrayByEmployee,
  options,
  disabled,
}: {
  tipsArrayByEmployee: any;
  options: any[];
  disabled: boolean;
}) {
  const { getValues, setValue } = useFormContext();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const tipsValues =
    useWatch({
      name: "tipsAdd",
    }) ?? [];

  useEffect(() => {
    if (!options?.length) return;

    const existingIds = new Set(tipsValues.map((t: any) => t.idEmployee));

    const newEmployees = options.filter((opt: any) => !existingIds.has(opt.id));

    if (newEmployees.length > 0) {
      tipsArrayByEmployee.append(
        newEmployees.map((emp: any) => ({
          ...createDefaultTipsAdd(),
          idEmployee: emp.id,
          employeeName: emp.name,
          shift: emp.idShift ?? "8-20",
          amount: [],
        })),
      );
    }
  }, [options]);

  const tipsMap = useMemo(() => {
    const map = new Map();
    tipsValues.forEach((t: any, index: number) => {
      map.set(t.idEmployee, { ...t, index });
    });
    return map;
  }, [tipsValues]);

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

    const newItem = { value, time, typeAmount };

    setValue(`tipsAdd.${index}.amount`, [...currentAmount, newItem]);
    setValue(`tipsAdd.${index}.tempValue`, "");
  };

  useEffect(() => {
    tipsValues.forEach((_: any, index: number) => {
      const current = getValues(`tipsAdd.${index}.typeAmount`);
      if (!current) {
        setValue(`tipsAdd.${index}.typeAmount`, "mdl");
      }
    });
  }, [tipsValues]);
  const allAmounts =
    tipsValues
      ?.flatMap((emp: any) =>
        (emp.amount || []).map((a: any) => ({
          employeeName: emp.employeeName,
          shift: emp.shift,
          value: a.value,
          typeAmount: a.typeAmount,
          time: a.time,
        })),
      )
      .reverse() ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full h-full md:p-8">
      <div className="flex flex-col gap-8 w-full">
        {options.map((opt: any, _visualIndex: number) => {
          const tip = tipsMap.get(opt.id);

          if (!tip) return null;

          const index = tip.index;

          const numericValue = getValues(`tipsAdd.${index}.tempValue`);
          const typeAmount = getValues(`tipsAdd.${index}.typeAmount`);

          return (
            <div
              key={opt.id}
              className={cn(
                "flex md:gap-12 items-center w-full justify-center",
                focusedIndex === index && "text-green-600",
                numericValue && "text-red-600!",
              )}
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleAddAmount(index)}
                className={cn(
                  "h-8 w-8 cursor-pointer",
                  numericValue && "bg-blue-600 text-white",
                )}
                disabled={!numericValue || !typeAmount}
              >
                {numericValue && typeAmount && (
                  <PlusIcon className="font-bold" />
                )}
              </Button>

              <NumericInput
                fieldName={`tipsAdd.${index}.tempValue`}
                className={cn("md:w-22 w-12", !numericValue && "bg-border")}
                onFocus={() => setFocusedIndex(index)}
              />

              <SelectField
                fieldName={`tipsAdd.${index}.typeAmount`}
                className="w-22"
                data={["mdl", "chips"]}
              />

              <TextInput
                fieldName={`tipsAdd.${index}.employeeName`}
                className="w-34 border-0 shadow-none font-bold"
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

      <div className="w-full hidden md:block" />

      <div className="flex flex-col gap-2 w-full overflow-auto max-h-[80vh]">
        {allAmounts.length === 0 && (
          <div className="text-sm text-muted-foreground">Нет данных</div>
        )}

        {allAmounts.map((item: any, i: number) => (
          <div
            key={i}
            className="grid grid-cols-5 text-xs justify-around w-full"
          >
            <span className="font-medium w-32">
              {item.employeeName.split(" ")[1]}
            </span>
            <span>{item.shift}</span>
            <span>{!disabled ? item.value : "***"}</span>
            <span>{!disabled ? item.typeAmount : "***"}</span>
            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
