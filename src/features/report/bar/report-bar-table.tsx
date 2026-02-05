"use client";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import TableTobacco from "./tobacco-table";
import TableExpenses from "./expenses-table";
import TableProductsTransfer from "./transfer-table";
import { TableInventory } from "./inventory-table";
import { Textarea } from "@/components/ui/textarea";
import TableCashVerify from "./cash-table";
import { useAbility } from "@/providers/AbilityProvider";
import { useFormContext } from "react-hook-form";
import { ReportBarFormValues } from "./schema";

export default function ReportBarTable() {
  const { isBar, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isBar);
  const form = useFormContext<ReportBarFormValues>();
  return (
    <>
      <div className="flex w-full justify-end">
        <DatePickerInput
          fieldName="date"
          className="md:w-30 h-8 text-sm w-full text-rd"
          disabled={!isAdmin}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[22%_20%_26%_20%] xl:justify-between">
        <TableTobacco disabled={isDisabled} />
        <TableExpenses disabled={isDisabled} />
        <TableProductsTransfer disabled={isDisabled} />
        <TableInventory disabled={isDisabled} />
      </div>
      <Textarea
        placeholder="notes ..."
        {...form.register("notes")}
        className="resize-none"
        disabled={isDisabled}
      />

      <TableCashVerify disabled={isDisabled} />
    </>
  );
}
