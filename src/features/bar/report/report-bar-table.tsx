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
      <div className="grid grid-cols-1 md:grid-cols-[25%_20%_20%_22%] justify-between my-4">
        <TableTobacco disabled={isDisabled} />
        <TableInventory disabled={isDisabled} />
        <TableExpenses disabled={isDisabled} />
        <TableProductsTransfer disabled={isDisabled} />
      </div>
      <TableCashVerify disabled={isDisabled} />
      <Textarea
        placeholder="notes ..."
        {...register("report.notes")}
        className="resize-none my-4"
        disabled={isDisabled}
      />
    </>
  );
}
