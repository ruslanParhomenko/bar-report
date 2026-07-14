"use client";

import NumericInput from "@/components/input-controlled/numeric-input";
import SelectInput from "@/components/select/select-input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ClockPlusIcon, Home, PlusIcon, UserX } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { TYPE_AMOUNT } from "./constants";

type TipsAddRowProps = {
  index: number;
  fieldId: string;
  isPending: boolean;
  currentTime: number;
  onConfirm: (index: number) => void;
  onOver: (index: number) => void;
  onAdd: (index: number) => void;
};

export default function TipsAddRow({
  index,
  fieldId,
  isPending,
  currentTime,
  onConfirm,
  onOver,
  onAdd,
}: TipsAddRowProps) {
  const { setValue } = useFormContext();

  const isMobile = useIsMobile();

  const tip = useWatch({ name: `tipsAdd.${index}` });

  const numericValue = tip?.draftValue ?? "";
  const typeAmount = tip?.typeAmount;

  const employeeTotal = (tip?.resultAmount || []).reduce(
    (s: number, v: any) => s + Number(v.value),
    0,
  );

  const endTime = new Date(tip?.endDate + (tip?.over || 0)).toLocaleTimeString(
    "ru-RU",
    { hour: "2-digit", minute: "2-digit" },
  );

  const isFinished = tip?.endDate < currentTime;

  return (
    <div
      key={fieldId}
      className={cn(
        "flex items-center justify-between md:grid md:grid-cols-3",
        tip?.isClosed && "line-through opacity-40",
      )}
    >
      <div className="flex items-center gap-1 md:gap-4">
        <div className="w-3 md:w-6">
          {isFinished && <Home className="text-rd h-3 w-3 md:h-4 md:w-4" />}
        </div>

        <div className="text-muted-foreground w-4 text-xs md:w-8">
          {tip?.isWaiters ? "w" : "b"}
        </div>

        <Switch
          checked={!!tip?.isWaiters}
          onCheckedChange={(val) =>
            setValue(`tipsAdd.${index}.isWaiters`, val, { shouldDirty: true })
          }
          disabled={isPending || tip?.isClosed || tip?.role === "waiters"}

          className={cn(isMobile && "h-5 w-8")}
        />

        <button
          type="button"
          onClick={() => onConfirm(index)}
          className="cursor-pointer px-2"
          disabled={isPending || tip?.isClosed}
        >
          <UserX className="text-rd h-3 w-3 md:h-4 md:w-4" />
        </button>

        <div className="ms:w-10 w-6 text-xs md:px-2">
          {employeeTotal.toFixed(0)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 md:gap-6">
        <SelectInput
          fieldName={`tipsAdd.${index}.typeAmount`}
          options={TYPE_AMOUNT}
          className="h-6! w-9 md:h-8! md:w-14"
        />

        <NumericInput
          fieldName={`tipsAdd.${index}.draftValue`}
          className={cn("h-5 w-6 md:h-8 md:w-14", !numericValue && "bg-bl")}
          disabled={isPending || tip?.isClosed}
        />

        <Button
          type="button"
          variant="ghost"
          onClick={() => onAdd(index)}
          disabled={!numericValue || !typeAmount || isPending || tip?.isClosed}
          className={cn(
            "h-6 w-6 cursor-pointer md:h-8 md:w-10",
            numericValue && "bg-red-600 text-white",
          )}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-center">
        <div className="text-bl w-18 truncate text-xs font-bold md:w-40 md:text-sm">
          {tip?.employeeName}
        </div>

        <div className="w-9 text-xs font-bold md:w-12 md:text-sm">
          {endTime}
        </div>

        <button
          type="button"
          className="flex w-8 cursor-pointer items-center justify-center md:w-12"
          onClick={() => onOver(index)}
        >
          <ClockPlusIcon className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}
