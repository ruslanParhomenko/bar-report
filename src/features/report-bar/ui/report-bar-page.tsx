"use client";
import { Textarea } from "@/components/ui/textarea";
import { BarForm } from "@/features/bar/model/schema";
import TableExpenses from "@/features/report-bar/ui/expenses-table";
import { TableInventory } from "@/features/report-bar/ui/inventory-table";
import TableProductsTransfer from "@/features/report-bar/ui/transfer-table";
import { useFormContext } from "react-hook-form";
import TableCashVerify from "./cash-table";
import TableTobacco from "./tobacco-table";

export function ReportBarPage({
  orderProducts,
}: {
  orderProducts: Record<string, string[]> | null;
}) {
  const { register } = useFormContext<BarForm>();

  return (
    <>
      <div className="my-4 grid grid-cols-1 justify-between md:grid-cols-[25%_20%_20%_22%]">
        <TableTobacco />
        <TableInventory />
        <TableExpenses />
        <TableProductsTransfer orderProducts={orderProducts} />
      </div>
      <TableCashVerify />
      <Textarea
        placeholder="notes ..."
        {...register("report.notes")}
        className="my-4 resize-none"
      />
    </>
  );
}
