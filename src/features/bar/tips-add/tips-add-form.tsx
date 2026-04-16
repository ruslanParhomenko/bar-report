"use client";

import { UseFieldArrayReturn, useFormContext, useWatch } from "react-hook-form";
import NumericInput from "@/components/inputs-form/numeric-input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { Home, PlusIcon, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { createDefaultTipsAdd } from "./schema";
import SelectInput from "@/components/select/select-input";
import { SHIFTS, TYPE_AMOUNT } from "./constants";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Switch } from "@/components/ui/switch";
import { BarFormValues } from "../schema";

export default function TipsAddForm({
  tipsArrayByEmployee,
  options,
  disabled,
  currency,
}: {
  tipsArrayByEmployee: UseFieldArrayReturn<BarFormValues, "tipsAdd", "fieldId">;
  options: {
    id: string;
    name: string;
    role: string;
    idShift: string | undefined;
  }[];
  disabled: boolean;
  currency: string;
}) {
  const { getValues, setValue } = useFormContext();

  const currentTime = new Date().getTime();

  const [tempValues, setTempValues] = useState<Record<number, string>>({});
  const [tempTypes, setTempTypes] = useState<Record<number, string>>({});
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const tipsValues =
    useWatch<BarFormValues, "tipsAdd">({
      name: "tipsAdd",
    }) ?? [];

  useEffect(() => {
    if (!options?.length) return;

    const current = getValues("tipsAdd") || [];
    const date = getValues("date");

    if (!date) return;

    const existingIds = new Set(current.map((e: any) => e.idEmployee));

    const SHIFT_DURATION_MS = 12 * 60 * 60 * 1000;

    const newEmployees = options.filter((emp: any) => !existingIds.has(emp.id));

    if (newEmployees.length > 0) {
      tipsArrayByEmployee.append(
        newEmployees.map((emp: any) => {
          const shift = emp.idShift ?? "8-20";

          const base = new Date(date);
          base.setHours(0, 0, 0, 0);

          const { hours, minutes } = SHIFTS[shift as keyof typeof SHIFTS];

          base.setHours(hours, minutes, 0, 0);

          return {
            ...createDefaultTipsAdd(),
            idEmployee: emp.id,
            employeeName: emp.name,
            shift,
            role: emp.role,
            amount: [],
            createdAt: Date.now(),
            endDate: base.getTime() + SHIFT_DURATION_MS,
            isWaiters: emp.role === "waiters",
            resultAmount: [],
            isClosed: false,
          };
        }),
      );
    }
  }, [options]);

  const handleAddAmount = (index: number) => {
    const value = tempValues[index];
    const typeAmount =
      tempTypes[index] ?? getValues(`tipsAdd.${index}.typeAmount`);

    if (!value) return;

    const currentAmount = getValues(`tipsAdd.${index}.amount`) || [];

    const time = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newItem = { value, time, typeAmount };

    setValue(`tipsAdd.${index}.amount`, [...currentAmount, newItem], {
      shouldDirty: true,
    });

    const numericValue = Number(value);
    const tipsMdl =
      typeAmount === "mdl" ? numericValue : numericValue * Number(currency);

    const isWaiters = getValues(`tipsAdd.${index}.isWaiters`);

    if (!isWaiters) {
      const currentResult = getValues(`tipsAdd.${index}.resultAmount`) || [];

      setValue(
        `tipsAdd.${index}.resultAmount`,
        [...currentResult, Number(tipsMdl.toFixed(2))],
        { shouldDirty: true },
      );

      setTempValues((p) => ({ ...p, [index]: "" }));
      return;
    }

    const allEmployees = getValues("tipsAdd") || [];
    const now = Date.now();

    const filtered = allEmployees.filter((emp: any) => {
      if (!emp.isWaiters || emp.isClosed) return false;
      return now >= emp.createdAt && now <= emp.endDate;
    });

    if (!filtered.length) return;

    const part = tipsMdl / 2;
    const perEmployee = part / filtered.length;

    filtered.forEach((emp: any) => {
      const empIndex = allEmployees.findIndex(
        (e: any) => e.idEmployee === emp.idEmployee,
      );

      const currentResult = getValues(`tipsAdd.${empIndex}.resultAmount`) || [];

      const isCurrent = empIndex === index;

      const valueToPush = isCurrent ? part + perEmployee : perEmployee;

      setValue(
        `tipsAdd.${empIndex}.resultAmount`,
        [...currentResult, Number(valueToPush.toFixed(2))],
        { shouldDirty: true },
      );
    });

    setTempValues((p) => ({ ...p, [index]: "" }));
  };

  const openConfirmModal = (index: number) => {
    startTransition(() => {
      setConfirmIndex(index);
    });
  };

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
    <>
      <Dialog
        open={confirmIndex !== null}
        onOpenChange={(open) => !open && setConfirmIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Закрыть сотрудника?</DialogTitle>
            <DialogDescription>
              Он будет исключён из распределения чаевых.
            </DialogDescription>
          </DialogHeader>

          <div className="text-sm font-medium">
            {confirmIndex !== null &&
              getValues(`tipsAdd.${confirmIndex}.employeeName`)}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmIndex(null)}>
              Отмена
            </Button>

            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                if (confirmIndex === null) return;

                setValue(`tipsAdd.${confirmIndex}.isClosed`, true, {
                  shouldDirty: true,
                });

                setConfirmIndex(null);
              }}
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full text-center text-xs text-muted-foreground">
        {currency}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[48%_5%_32%] justify-between w-full md:gap-4 md:p-4">
        <div className="flex flex-col gap-4">
          {tipsArrayByEmployee.fields.map((field, index) => {
            const tip = tipsValues[index];

            const isFocused = index === focusedIndex;

            const timeEnd = tip?.endDate;

            const isFinished = timeEnd < currentTime;

            const numericValue = tempValues[index] || "";
            const typeAmount =
              tempTypes[index] ?? getValues(`tipsAdd.${index}.typeAmount`);

            const employeeTotal = (tip?.resultAmount || []).reduce(
              (s: number, v: any) => s + Number(v),
              0,
            );

            return (
              <div
                key={field.fieldId}
                className={cn(
                  "flex items-center justify-between",
                  tip?.isClosed && "opacity-40 line-through",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-5">
                    {isFinished && <Home className="h-4 w-4 text-rd" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tip?.isWaiters ? "waiters" : "barmen"}
                  </div>

                  <Switch
                    checked={!!tip?.isWaiters}
                    onCheckedChange={(val) =>
                      setValue(`tipsAdd.${index}.isWaiters`, val, {
                        shouldDirty: true,
                      })
                    }
                    disabled={
                      isPending || tip?.isClosed || tip?.role === "waiters"
                    }
                  />

                  <button
                    type="button"
                    onClick={() => openConfirmModal(index)}
                    className="cursor-pointer mx-2"
                  >
                    <UserX className="w-4 h-4 text-rd" />
                  </button>

                  <div className="w-6 px-2 text-xs">
                    {employeeTotal.toFixed(0)}
                  </div>
                </div>

                <div
                  className={cn(
                    "text-sm font-bold text-bl",
                    isFocused && "text-rd!",
                  )}
                >
                  {tip?.employeeName}
                </div>
                <div className="text-sm font-bold text-bl">{tip?.shift}</div>

                <div className="flex gap-8">
                  <SelectInput
                    value={typeAmount}
                    onChange={(val: string) =>
                      setTempTypes((p) => ({ ...p, [index]: val }))
                    }
                    options={TYPE_AMOUNT}
                    className="w-14 h-7!"
                  />

                  <NumericInput
                    value={numericValue}
                    onChange={(val: string) =>
                      setTempValues((p) => ({ ...p, [index]: val }))
                    }
                    className={cn("w-14 h-7", !numericValue && "bg-bl")}
                    onFocus={() => setFocusedIndex(index)}
                    disabled={isPending || tip?.isClosed}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleAddAmount(index)}
                    disabled={
                      !numericValue || !typeAmount || isPending || tip?.isClosed
                    }
                    className={cn(
                      "h-8 w-10 cursor-pointer",
                      numericValue && "bg-red-600 text-white",
                    )}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden xl:block" />

        <div className="flex flex-col gap-2 md:mx-4">
          {allAmounts.map((item: any, i: number) => (
            <div
              key={i}
              className="grid grid-cols-5 text-xs w-full [&>span]:text-center"
            >
              <span className="text-start!">
                {item.employeeName.split(" ")[1]}{" "}
                {item.employeeName.split(" ")[0].slice(0, 1)}
              </span>
              <span>{item.shift}</span>
              <span>{disabled ? "***" : item.value}</span>
              <span>{disabled ? "***" : item.typeAmount}</span>
              <span>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
