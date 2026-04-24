"use client";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import TableCashVerify from "./cash-table";
import TableTobacco from "./tobacco-table";

import { BarFormValues } from "../schema";
import TableExpenses from "./expenses-table";
import { TableInventory } from "./inventory-table";
import TableProductsTransfer from "./transfer-table";

export default function ReportBarTable({
  isDisabled,
}: {
  isDisabled: boolean;
}) {
  const { register } = useFormContext<BarFormValues>();

  return (
    <>
      <div className="my-4 grid grid-cols-1 justify-between md:grid-cols-[25%_20%_20%_22%]">
        <TableTobacco disabled={isDisabled} />
        <TableInventory disabled={isDisabled} />
        <TableExpenses disabled={isDisabled} />
        <TableProductsTransfer disabled={isDisabled} />
      </div>
      <TableCashVerify disabled={isDisabled} />
      <Textarea
        placeholder="notes ..."
        {...register("report.notes")}
        className="my-4 resize-none"
        disabled={isDisabled}
      />
    </>
  );
}
