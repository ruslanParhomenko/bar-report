"use client";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import TableCashVerify from "./cash-table";
import TableTobacco from "./tobacco-table";

import { DataOrderProducts } from "@/features/settings/setting/model/type";
import { BarForm } from "../../bar-page/model/schema";
import TableExpenses from "./expenses-table";
import { TableInventory } from "./inventory-table";
import TableProductsTransfer from "./transfer-table";

export function ReportBarPage({
  isDisabled,
  orderProducts,
}: {
  isDisabled: boolean;
  orderProducts: DataOrderProducts | null;
}) {
  const { register } = useFormContext<BarForm>();

  return (
    <>
      <div className="my-4 grid grid-cols-1 justify-between md:grid-cols-[25%_20%_20%_22%]">
        <TableTobacco disabled={isDisabled} />
        <TableInventory disabled={isDisabled} />
        <TableExpenses disabled={isDisabled} />
        <TableProductsTransfer
          disabled={isDisabled}
          orderProducts={orderProducts}
        />
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
