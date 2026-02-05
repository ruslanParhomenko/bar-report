"use client";
import TableTobacco from "./tobacco-table";
import { Textarea } from "@/components/ui/textarea";
import TableCashVerify from "./cash-table";
import { useFormContext } from "react-hook-form";
import { ReportBarFormValues } from "./schema";
import TableExpenses from "./expenses-table";
import { TableInventory } from "./inventory-table";
import TableProductsTransfer from "./transfer-table";

export default function ReportBarTable({
  isDisabled,
}: {
  isDisabled: boolean;
}) {
  const { register } = useFormContext<ReportBarFormValues>();
  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 xl:grid-cols-[22%_20%_26%_20%] xl:justify-between">
        <TableTobacco disabled={isDisabled} />
        <TableExpenses disabled={isDisabled} />
        <TableProductsTransfer disabled={isDisabled} />
        <TableInventory disabled={isDisabled} />
      </div>
      <Textarea
        placeholder="notes ..."
        {...register("notes")}
        className="resize-none"
        disabled={isDisabled}
      />

      <TableCashVerify disabled={isDisabled} />
    </div>
  );
}
