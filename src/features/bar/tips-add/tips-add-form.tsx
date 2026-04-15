"use client";

import { useFormContext, useWatch } from "react-hook-form";
import NumericInput from "@/components/inputs-form/numeric-input";
import TextInput from "@/components/inputs-form/text-input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo, useTransition } from "react";
import { PlusIcon, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { createDefaultTipsAdd, TipsAddFormValues } from "./schema";
import SelectInput from "@/components/select/select-input";
import { TYPE_AMOUNT } from "./constants";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Switch } from "@/components/ui/switch";

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

  const [tempValues, setTempValues] = useState<Record<number, string>>({});
  const [tempTypes, setTempTypes] = useState<Record<number, string>>({});
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const tipsValues = useWatch({ name: "tipsAdd" }) ?? [];

  const mergeEmployees = (tipsAdd: TipsAddFormValues[]) => {
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

  console.log(employees);

  useEffect(() => {
    if (!options?.length) return;

    const existingIds = new Set(tipsValues.map((t: any) => t.idEmployee));

    const newEmployees = options.filter((opt: any) => !existingIds.has(opt.id));

    if (newEmployees.length > 0) {
      const now = Math.floor(Date.now() / 1000); // Unix seconds
      const shiftDuration = 12 * 60 * 60; // 12 hours in seconds

      tipsArrayByEmployee.append(
        newEmployees.map((emp: any) => {
          return {
            ...createDefaultTipsAdd(),
            idEmployee: emp.id,
            employeeName: emp.name,
            shift: emp.idShift ?? "8-20",
            role: emp.role,
            amount: [],

            // ✅ unix timestamp
            createdAt: now,

            // ❗ endDate теперь тоже timestamp
            endDate: now + shiftDuration,

            isWaiters: emp.role === "waiters",
            resultAmount: [],
            isClosed: false,
          };
        }),
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

  const data = new Date().toISOString();
  console.log(data);
  const handleAddAmount = (index: number) => {
    const value = tempValues[index];
    const typeAmount =
      tempTypes[index] ?? getValues(`tipsAdd.${index}.typeAmount`);

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

    if (tempTypes[index] !== undefined) {
      setValue(`tipsAdd.${index}.typeAmount`, tempTypes[index], {
        shouldDirty: true,
      });
    }

    const allEmployees = getValues("tipsAdd") || [];

    const currentTime = Math.floor(Date.now() / 1000);

    const isWaiters = getValues(`tipsAdd.${index}.isWaiters`);
    const numericValue = Number(value);

    const tipsMdl =
      typeAmount === "mdl" ? numericValue : numericValue * Number(currency);

    // ===== BARMEN (без распределения) =====
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

    // ===== WAITERS =====
    const filtered = allEmployees.filter((emp: any) => {
      if (!emp.isWaiters) return false;
      if (emp.isClosed) return false;

      const start = emp.createdAt;
      const end = emp.endDate;

      return currentTime >= start && currentTime <= end;
    });

    if (!filtered.length) return;

    const partTips = tipsMdl / 2;
    const partTipsToEmployee = partTips / filtered.length;

    filtered.forEach((emp: any) => {
      const empIndex = allEmployees.findIndex(
        (e: any) => e.idEmployee === emp.idEmployee,
      );

      const currentResult = getValues(`tipsAdd.${empIndex}.resultAmount`) || [];

      const isCurrent = empIndex === index;

      const valueToPush = isCurrent
        ? partTips + partTipsToEmployee
        : partTipsToEmployee;

      setValue(
        `tipsAdd.${empIndex}.resultAmount`,
        [...currentResult, Number(valueToPush.toFixed(2))],
        { shouldDirty: true },
      );
    });

    setTempValues((p) => ({ ...p, [index]: "" }));
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
      {/* MODAL */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 w-full md:p-4">
        <div className="flex flex-col gap-4 md:mx-12">
          {options.map((opt: any) => {
            const tip = tipsMap.get(opt.id);
            if (!tip) return null;

            console.log("tip", tip);

            const index = tip.index;

            const numericValue = tempValues[index] || "";
            const typeAmount =
              tempTypes[index] ?? getValues(`tipsAdd.${index}.typeAmount`);

            const employeeTotal = (tip.resultAmount || []).reduce(
              (s: number, v: any) => s + Number(v),
              0,
            );

            return (
              <div
                key={opt.id}
                className={cn(
                  "flex items-center justify-between gap-1",
                  tip.isClosed && "opacity-40 line-through",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="text-xs text-muted-foreground md:w-12">
                    {" "}
                    {tip.isWaiters ? "waiters" : "barmen"}{" "}
                  </div>
                  <Switch
                    checked={tip.isWaiters}
                    onCheckedChange={(val) =>
                      setValue(`tipsAdd.${index}.isWaiters`, val, {
                        shouldDirty: true,
                      })
                    }
                    disabled={
                      isPending || tip.isClosed || tip.role === "waiters"
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      startTransition(() => setConfirmIndex(index))
                    }
                    className="cursor-pointer mx-2"
                  >
                    <UserX className="w-4 h-4 text-rd" />
                  </button>
                  <div className="w-6 px-2 text-xs">
                    {employeeTotal.toFixed(0)}
                  </div>
                </div>
                <div className="flex">
                  <TextInput
                    fieldName={`tipsAdd.${index}.employeeName`}
                    className="w-32 bg-transparent! border-0 shadow-none font-bold p-1 pb-0 text-bl"
                    readonly
                  />

                  <TextInput
                    fieldName={`tipsAdd.${index}.shift`}
                    className="w-12 bg-transparent! border-0 shadow-none font-bold p-1 pb-0 text-xs justify-center items-center"
                    disabled
                  />
                </div>
                <div className="flex gap-8">
                  <SelectInput
                    value={typeAmount}
                    onChange={(val: string) =>
                      setTempTypes((p) => ({ ...p, [index]: val }))
                    }
                    options={TYPE_AMOUNT}
                    className="w-14 h-7!"
                    placeHolder="..."
                  />

                  <NumericInput
                    value={numericValue}
                    onChange={(val: string) =>
                      setTempValues((prev) => ({ ...prev, [index]: val }))
                    }
                    className={cn("w-12 h-7", !numericValue && "bg-bl")}
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
                    disabled={
                      !numericValue || !typeAmount || isPending || tip.isClosed
                    }
                  >
                    {" "}
                    <PlusIcon className="font-bold" />{" "}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 md:mx-4">
          {allAmounts.map((item: any, i: number) => (
            <div
              key={i}
              className="grid grid-cols-5 text-xs w-full [&>span]:text-center md:px-4"
            >
              {" "}
              <span className="text-start! px-4">
                {" "}
                {item.employeeName.split(" ")[1]}{" "}
                {item.employeeName.split(" ")[0].slice(0, 1)}{" "}
              </span>{" "}
              <span>{item.shift}</span> <span>{item.value}</span>{" "}
              <span>{item.typeAmount}</span> <span>{item.time}</span>{" "}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
