"use client";

import { Switch } from "@/components/ui/switch";
import TipsNumericInput from "@/features/tips-add/ui/add-tips-popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ClockPlusIcon, Home, UserX } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

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

  const endTime = new Date(tip?.endDate + (tip?.over || 0)).toLocaleTimeString(
    "ru-RU",
    { hour: "2-digit", minute: "2-digit" },
  );

  const isFinished = tip?.endDate + (tip?.over || 0) < currentTime;

  return (
    <div
      key={fieldId}
      className={cn(
        "flex items-center justify-around gap-12 md:grid md:grid-cols-3",
        tip?.isClosed && "line-through opacity-40",
      )}
    >
      <TipsNumericInput
        fieldName={`tipsAdd.${index}.draftValue`}
        typeFieldName={`tipsAdd.${index}.typeAmount`}
        onAdd={() => onAdd(index)}
        disabled={isPending || tip?.isClosed || isFinished}
        employeeName={tip?.employeeName}
        index={index}
      />

      <div className="flex items-center justify-center md:w-60">
        <div className="w-9 text-xs font-bold md:w-20 md:text-sm">
          {endTime}
        </div>

        <button
          type="button"
          className="flex w-8 cursor-pointer items-center justify-center md:w-22"
          onClick={() => !tip?.isClosed && onOver(index)}
        >
          <ClockPlusIcon className="h-4 w-4 text-red-600" />
        </button>
      </div>
      <div className="flex items-center gap-1 md:gap-6">
        <div className="w-3 md:w-12">
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
          disabled={isPending || tip?.isClosed || isFinished}
        >
          <UserX className="text-rd h-3 w-3 md:h-4 md:w-6" />
        </button>
      </div>
    </div>
  );
}
