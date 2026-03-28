"use client";
import TableTobacco from "./tobacco-table";
import { Textarea } from "@/components/ui/textarea";
import TableCashVerify from "./cash-table";
import { useFormContext } from "react-hook-form";

import TableExpenses from "./expenses-table";
import { TableInventory } from "./inventory-table";
import TableProductsTransfer from "./transfer-table";
import { BarFormValues } from "../schema";

export default function ReportBarTable({
  isDisabled,
}: {
  isDisabled: boolean;
}) {
  const { register } = useFormContext<BarFormValues>();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[22%_18%_16%_22%_16%] justify-between">
        <TableTobacco disabled={isDisabled} />
        <TableInventory disabled={isDisabled} />
        <TableExpenses disabled={isDisabled} />
        <TableProductsTransfer disabled={isDisabled} />
        <TableCashVerify disabled={isDisabled} />
      </div>
      <Textarea
        placeholder="notes ..."
        {...register("report.notes")}
        className="resize-none h-8 min-h-0 py-0"
        disabled={isDisabled}
      />
    </>
  );
}
