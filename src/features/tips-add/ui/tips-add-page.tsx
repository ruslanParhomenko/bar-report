"use client";

import ModalConfirm from "@/components/modal/modal-confirm";
import { BarForm } from "@/features/bar/model/schema";
import { SHIFTS } from "@/features/tips-add/model/constants";
import { createDefaultTipsAdd } from "@/features/tips-add/model/schema";
import { LatestAmount } from "@/features/tips-add/ui/latest-amounts-row";
import TipsAddRow from "@/features/tips-add/ui/tips-add-row";
import { useEffect, useState, useTransition } from "react";
import { UseFieldArrayReturn, useFormContext, useWatch } from "react-hook-form";

// const ITEM_KEYS = ["personal", "result"] as const;
// type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

// const BAR_KEYS: BarKey[] = [
//   { key: "personal", color: "var(--color-bl)", visible: true },
//   { key: "result", color: "var(--color-gn)", visible: false },
// ];

export function TipsAddPage({
  tipsArrayByEmployee,
  options,
  disabled,
  currency,
}: {
  tipsArrayByEmployee: UseFieldArrayReturn<BarForm, "tipsAdd", "fieldId">;
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

  const currentTime = Date.now();

  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [confirmOverIndex, setConfirmOverIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  // const [barKeys, setBarKeys] = useState(BAR_KEYS);

  const tipsValues = useWatch<BarForm, "tipsAdd">({ name: "tipsAdd" }) ?? [];

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
            draftValue: "",
          };
        }),
      );
    }
  }, [options]);

  const handleAddAmount = (index: number) => {
    const value = getValues(`tipsAdd.${index}.draftValue`);
    const typeAmount = getValues(`tipsAdd.${index}.typeAmount`);
    if (!value) return;

    const tip = getValues(`tipsAdd.${index}`);
    const currentAmount = tip?.amount || [];

    const time = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const uniqueId = Date.now().toString();

    setValue(
      `tipsAdd.${index}.amount`,
      [...currentAmount, { value, time, typeAmount, uniqueId }],
      {
        shouldDirty: true,
      },
    );

    const numericValue = Number(value);
    const tipsMdl =
      typeAmount === "mdl" ? numericValue : numericValue * Number(currency);
    const isWaiters = getValues(`tipsAdd.${index}.isWaiters`);

    if (!isWaiters) {
      const currentResult = getValues(`tipsAdd.${index}.resultAmount`) || [];
      setValue(
        `tipsAdd.${index}.resultAmount`,
        [...currentResult, { value: Number(tipsMdl.toFixed(2)), uniqueId }],
        { shouldDirty: true },
      );
      setValue(`tipsAdd.${index}.draftValue`, "", { shouldDirty: true });
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
      const valueToPush = empIndex === index ? part + perEmployee : perEmployee;

      setValue(
        `tipsAdd.${empIndex}.resultAmount`,
        [...currentResult, { value: Number(valueToPush.toFixed(2)), uniqueId }],
        { shouldDirty: true },
      );
    });

    setValue(`tipsAdd.${index}.draftValue`, "", { shouldDirty: true });
  };

  // const chartData = tipsValues.map((emp) => ({
  //   name: emp.employeeName.split(" ")[0],
  //   result: Math.round(
  //     emp.resultAmount.reduce((acc, cur) => acc + +cur.value, 0),
  //   ),
  //   personal: Math.round(
  //     emp.amount.reduce(
  //       (acc, cur) =>
  //         cur.typeAmount === "mdl"
  //           ? acc + Number(cur.value)
  //           : acc + Number(cur.value) * Number(currency),
  //       0,
  //     ),
  //   ),
  // }));

  // const toggleBar = (key: BarKey["key"]) =>
  //   setBarKeys((prev) => toggleBarVisibility(prev, key));

  return (
    <div className="flex h-[80dvh] w-full flex-col gap-1 md:px-2">
      <ModalConfirm
        open={confirmOverIndex !== null}
        setOpen={(open) => !open && setConfirmOverIndex(null)}
        dialogText="addOvertime"
        descriptionText={
          confirmOverIndex !== null
            ? getValues(`tipsAdd.${confirmOverIndex}.employeeName`)
            : undefined
        }
        confirmDisabled={isPending}
        handleConfirm={() => {
          if (confirmOverIndex === null) return;
          const currentOver =
            getValues(`tipsAdd.${confirmOverIndex}.over`) || 0;
          setValue(
            `tipsAdd.${confirmOverIndex}.over`,
            currentOver + 60 * 60 * 1000,
            {
              shouldDirty: true,
            },
          );
          setConfirmOverIndex(null);
        }}
      />

      <ModalConfirm
        open={confirmIndex !== null}
        setOpen={(open) => !open && setConfirmIndex(null)}
        dialogText="closeEmployee"
        descriptionText={
          confirmIndex !== null
            ? getValues(`tipsAdd.${confirmIndex}.employeeName`)
            : undefined
        }
        confirmDisabled={isPending}
        handleConfirm={() => {
          if (confirmIndex === null) return;
          setValue(`tipsAdd.${confirmIndex}.isClosed`, true, {
            shouldDirty: true,
          });
          setValue(`tipsAdd.${confirmIndex}.endDate`, Date.now(), {
            shouldDirty: true,
          });
          setConfirmIndex(null);
        }}
      />

      <div className="text-muted-foreground w-full text-center text-xs">
        {currency}
      </div>

      <div className="flex h-full flex-col items-center justify-center gap-4 md:gap-10">
        {tipsArrayByEmployee.fields.map((field, index) => (
          <TipsAddRow
            key={field.fieldId}
            index={index}
            fieldId={field.fieldId}
            isPending={isPending}
            currentTime={currentTime}
            onConfirm={(i) => startTransition(() => setConfirmIndex(i))}
            onOver={(i) => startTransition(() => setConfirmOverIndex(i))}
            onAdd={handleAddAmount}
          />
        ))}
      </div>
      <div className="flex w-[20dvw] items-center justify-between">
        <LatestAmount tipsValues={tipsValues} />
      </div>
    </div>
  );
}
