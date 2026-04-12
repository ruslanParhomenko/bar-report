"use client";

import { useFormContext, useWatch } from "react-hook-form";
import NumericInput from "@/components/inputs-form/numeric-input";
import TextInput from "@/components/inputs-form/text-input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createDefaultTipsAdd, TipsAddFormValues } from "./schema";
import SelectInput from "@/components/select/select-input";
import { TYPE_AMOUNT } from "./constants";
import { useTipsCalculation } from "@/hooks/use-tips-calculation";

export default function TipsAddForm({
  tipsArrayByEmployee,
  options,
  disabled,
  currency,
}: {
  tipsArrayByEmployee: any;
  options: any[];
  disabled: boolean;
  currency: string;
}) {
  const { getValues, setValue } = useFormContext();

  const mergeEmployees = (
    tipsAdd: TipsAddFormValues[],
  ): TipsAddFormValues[] => {
    const map = new Map();

    tipsAdd.forEach((emp) => {
      if (!map.has(emp.idEmployee)) {
        map.set(emp.idEmployee, {
          ...emp,
          amount: [...(emp.amount || [])],
        });
      } else {
        const existing = map.get(emp.idEmployee);
        existing.amount.push(...(emp.amount || []));
      }
    });

    return Array.from(map.values());
  };

  const employees = mergeEmployees(tipsArrayByEmployee.fields);

  const [tempValues, setTempValues] = useState<Record<number, string>>({});
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
          role: emp.role,
          amount: [],
        })),
      );
    }
  }, [options, tipsArrayByEmployee, tipsValues]);

  const tipsMap = useMemo(() => {
    const map = new Map();
    tipsValues.forEach((t: any, index: number) => {
      map.set(t.idEmployee, { ...t, index });
    });
    return map;
  }, [tipsValues]);

  const handleAddAmount = (index: number) => {
    const value = tempValues[index];
    const typeAmount = getValues(`tipsAdd.${index}.typeAmount`);

    if (!value) return;

    const currentAmount = getValues(`tipsAdd.${index}.amount`) || [];

    const now = new Date();
    const time = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newItem = { value, time, typeAmount };

    setValue(`tipsAdd.${index}.amount`, [...currentAmount, newItem], {
      shouldDirty: true,
    });

    setTempValues((prev) => ({ ...prev, [index]: "" }));
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
          role: emp.role,
          idEmployee: emp.idEmployee,
        })),
      )
      .reverse() ?? [];

  const { getEmployeeTotal } = useTipsCalculation(employees, Number(currency));

  const maskValue = (value: string | number, isAdmin: boolean) => {
    const str = String(value);

    if (isAdmin) return str;
    if (str.length === 0) return "";

    return str[0] + "*".repeat(str.length - 1);
  };

  return (
    <>
      <div className="w-full text-center text-xs text-muted-foreground">
        {currency}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 w-full h-full md:p-8">
        <div className="flex flex-col md:gap-8 gap-4 w-full">
          {options.map((opt: any) => {
            const tip = tipsMap.get(opt.id);
            if (!tip) return null;

            const index = tip.index;

            const numericValue = tempValues[index] || "";
            const typeAmount = getValues(`tipsAdd.${index}.typeAmount`);

            const employeeTotal = getEmployeeTotal(tip);

            return (
              <div
                key={opt.id}
                className={cn(
                  "flex md:gap-6 items-center w-full md:justify-center justify-between",
                  focusedIndex === index && "text-green-600",
                  numericValue && "text-red-600!",
                )}
              >
                <div className="text-xs text-muted-foreground md:w-12">
                  {employeeTotal.toFixed(0)}
                </div>
                <TextInput
                  fieldName={`tipsAdd.${index}.employeeName`}
                  className="w-38 bg-transparent! border-0 shadow-none font-bold p-1 pb-0 text-bl"
                  readonly
                />

                <TextInput
                  fieldName={`tipsAdd.${index}.shift`}
                  className="w-12 bg-transparent! border-0 shadow-none font-bold p-1 pb-0 text-xs justify-center items-center"
                  disabled
                />
                <SelectInput
                  fieldName={`tipsAdd.${index}.typeAmount`}
                  className="w-14 justify-center"
                  options={TYPE_AMOUNT}
                />
                <NumericInput
                  value={numericValue}
                  onChange={(val: string) =>
                    setTempValues((prev) => ({
                      ...prev,
                      [index]: val,
                    }))
                  }
                  className={cn("w-12 h-7", !numericValue && "bg-bl ")}
                  onFocus={() => setFocusedIndex(index)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleAddAmount(index)}
                  className={cn(
                    "h-8 w-10 cursor-pointer",
                    numericValue && "bg-red-600 text-white",
                  )}
                  disabled={!numericValue || !typeAmount}
                >
                  {numericValue && typeAmount && (
                    <PlusIcon className="font-bold" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 w-full overflow-auto max-h-[80vh]">
          {allAmounts.map((item: any, i: number) => (
            <div
              key={i}
              className="grid grid-cols-5 text-xs justify-between w-full [&>span]:text-center"
            >
              <span>{item.employeeName.split(" ")[1]}</span>
              <span>{item.shift}</span>
              <span>{!disabled ? item.value : "***"}</span>
              <span>{!disabled ? item.typeAmount : "***"}</span>
              <span>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
