"use client";

import NumericInput from "@/components/input-controlled/numeric-input";
import SelectInput from "@/components/select/select-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClockPlusIcon, Home, PlusIcon, UserX } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { UseFieldArrayReturn, useFormContext, useWatch } from "react-hook-form";
import { SHIFTS, TYPE_AMOUNT } from "./constants";
import { createDefaultTipsAdd } from "./schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  const [confirmOverIndex, setConfirmOverIndex] = useState<number | null>(null);
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
            over: 0,
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

    const uniqueId = new Date().getTime().toString();

    const newItem = { value, time, typeAmount, uniqueId };

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
        [
          ...currentResult,
          {
            value: Number(tipsMdl.toFixed(2)),
            uniqueId,
          },
        ],
        { shouldDirty: true },
      );

      setTempValues((p) => ({ ...p, [index]: "" }));
      return;
    }

    const allEmployees = getValues("tipsAdd") || [];
    const now = Date.now();

    const filtered = allEmployees.filter((emp: any) => {
      if (!emp.isWaiters || emp.isClosed) return false;
      return now >= emp.createdAt && now <= emp.endDate + (emp.over || 0);
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
        [
          ...currentResult,
          {
            value: Number(valueToPush.toFixed(2)),
            uniqueId,
          },
        ],
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

  const openOverModal = (index: number) => {
    startTransition(() => {
      setConfirmOverIndex(index);
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
        open={confirmOverIndex !== null}
        onOpenChange={(open) => !open && setConfirmOverIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить овертайм?</DialogTitle>
            <DialogDescription>
              Добавить сотруднику +1 час к смене.
            </DialogDescription>
          </DialogHeader>

          <div className="text-sm font-medium">
            {confirmOverIndex !== null &&
              getValues(`tipsAdd.${confirmOverIndex}.employeeName`)}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOverIndex(null)}>
              Отмена
            </Button>

            <Button
              disabled={isPending}
              onClick={() => {
                if (confirmOverIndex === null) return;

                const currentOver =
                  getValues(`tipsAdd.${confirmOverIndex}.over`) || 0;

                const ONE_HOUR = 60 * 60 * 1000;

                setValue(
                  `tipsAdd.${confirmOverIndex}.over`,
                  currentOver + ONE_HOUR,
                  { shouldDirty: true },
                );

                setConfirmOverIndex(null);
              }}
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

      <div className="text-muted-foreground w-full text-center text-xs">
        {currency}
      </div>

      <div className="grid h-full w-full gap-4 md:grid-cols-[60%_40%] md:p-4">
        <div className="flex flex-col gap-4 overflow-auto">
          {tipsArrayByEmployee.fields.map((field, index) => {
            const tip = tipsValues[index];

            const isFocused = index === focusedIndex;

            const timeEnd = tip?.endDate;

            console.log(
              tip.employeeName,
              ":",
              timeEnd,
              "current:",
              currentTime,
              "over:",
              tip.over,
            );

            const isFinished = timeEnd < currentTime;

            const numericValue = tempValues[index] || "";
            const typeAmount =
              tempTypes[index] ?? getValues(`tipsAdd.${index}.typeAmount`);

            const employeeTotal = (tip?.resultAmount || []).reduce(
              (s: number, v: any) => s + Number(v.value),
              0,
            );

            const endTime = new Date(
              tip?.endDate + (tip?.over || 0),
            ).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={field.fieldId}
                className={cn(
                  "flex items-center justify-between md:grid md:grid-cols-3",
                  tip?.isClosed && "line-through opacity-40",
                )}
              >
                <div className="flex items-center md:gap-4">
                  <div className="w-4 md:w-6">
                    {isFinished && <Home className="text-rd h-4 w-4" />}
                  </div>
                  <div className="text-muted-foreground w-8 text-xs">
                    {tip?.isWaiters ? "w" : "b"}
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
                    className="md:mx-2"
                  />

                  <button
                    type="button"
                    onClick={() => openConfirmModal(index)}
                    className="cursor-pointer px-2"
                  >
                    <UserX className="text-rd h-4 w-4" />
                  </button>

                  <div className="w-10 px-2 text-xs">
                    {employeeTotal.toFixed(0)}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 md:gap-6">
                  <SelectInput
                    value={typeAmount}
                    onChange={(val: string) =>
                      setTempTypes((p) => ({ ...p, [index]: val }))
                    }
                    options={TYPE_AMOUNT}
                    className="h-8! w-8 md:w-14"
                  />

                  <NumericInput
                    value={numericValue}
                    onChange={(val: string) =>
                      setTempValues((p) => ({ ...p, [index]: val }))
                    }
                    className={cn("h-8 w-8 md:w-14", !numericValue && "bg-bl")}
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
                      "h-8 w-8 cursor-pointer md:w-10",
                      numericValue && "bg-red-600 text-white",
                    )}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-center">
                  <div
                    className={cn(
                      "text-bl w-20 truncate text-sm font-bold md:w-40",
                      isFocused && "text-rd!",
                    )}
                  >
                    {tip?.employeeName}
                  </div>

                  <div className="w-12 text-sm font-bold">{endTime}</div>
                  <button
                    type="button"
                    className="flex w-12 cursor-pointer items-center justify-center"
                    onClick={() => openOverModal(index)}
                  >
                    <ClockPlusIcon className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 overflow-auto md:mx-4 md:h-[80vh]">
          {allAmounts.map((item: any, i: number) => (
            <div
              key={i}
              className="[&>span]:text-muted-foreground grid w-full grid-cols-5 text-xs [&>span]:p-0.5 [&>span]:text-center"
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
