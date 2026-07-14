"use client";

import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import ModalConfirm from "@/components/modal/modal-confirm";
import { useEffect, useState, useTransition } from "react";
import { UseFieldArrayReturn, useFormContext, useWatch } from "react-hook-form";
import { BarForm } from "../schema";
import { SHIFTS } from "./constants";
import { createDefaultTipsAdd } from "./schema";
import TipsAddRow from "./tips-add-row";

type ChartDataItem = { name: string; personal: number; result: number };
type BarKey = keyof Omit<ChartDataItem, "name">;
type BarItem = { key: BarKey; color: string; label: string };

const BAR_KEYS: BarItem[] = [
  { key: "personal", color: "var(--color-bl)", label: "personal" },
  { key: "result", color: "var(--color-gn)", label: "result" },
];

export default function TipsAddForm({
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
  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    personal: true,
    result: false,
  });

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

    const tip = getValues(`tipsAdd.${index}`); // getValues вместо tipsValues[index]
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

  const allAmounts = tipsValues
    .flatMap((emp: any) =>
      (emp.amount || []).map((a: any) => ({
        employeeName: emp.employeeName,
        shift: emp.shift,
        value: a.value,
        typeAmount: a.typeAmount,
        time: a.time,
      })),
    )
    .reverse();

  const chartData = tipsValues.map((emp) => ({
    name: emp.employeeName.split(" ")[0],
    result: Math.round(
      emp.resultAmount.reduce((acc, cur) => acc + +cur.value, 0),
    ),
    personal: Math.round(
      emp.amount.reduce(
        (acc, cur) =>
          cur.typeAmount === "mdl"
            ? acc + Number(cur.value)
            : acc + Number(cur.value) * Number(currency),
        0,
      ),
    ),
  }));

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

      <div className="grid h-[50dvh] gap-4 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3.5 overflow-auto">
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

        <div className="flex flex-col gap-1 overflow-auto">
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

      <div className="flex h-1/3 flex-col">
        <CustomChart
          chartData={chartData}
          barItem={BAR_KEYS.filter(({ key }) => visibleBars[key])}
          className="m-0 h-full p-0"
          disableYAxis={disabled}
          withLabelLIst={false}
        />
        <CustomLegend
          items={BAR_KEYS}
          visibleItems={visibleBars}
          onToggle={(key) =>
            setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }))
          }
          className="m-0!"
        />
      </div>
    </div>
  );
}
