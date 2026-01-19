"use client";
import { useForm } from "react-hook-form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { toast } from "sonner";
import {
  cashVerifyDefault,
  expensesDefault,
  inventoryDefault,
  productTransferDefault,
  ReportBarFormValues,
  reportBarSchema,
} from "./schema";
import TableTobacco from "./tobacco-table";
import TableExpenses from "./expenses-table";
import TableCashVerify from "./cash-table";
import TableProductsTransfer from "./transfer-table";
import { Textarea } from "@/components/ui/textarea";
import { TableInventory } from "./inventory-table";
import { createReportBar } from "@/app/actions/archive/reportBarAction";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ReportBarForm() {
  const STORAGE_KEY = "report-bar";

  //form
  const form = useForm({
    defaultValues: reportBarSchema.parse({}),
    resolver: zodResolver(reportBarSchema),
  });

  // localstorage
  const { isLoaded, resetForm } = useLocalStorageForm(form, STORAGE_KEY);

  //submit
  const onSubmit = async (data: ReportBarFormValues) => {
    const formateData = {
      ...data,
      tobacco: data.tobacco?.map((item) => ({
        ...item,
        stock: item.stock,
        incoming: item.incoming ?? "0",
        outgoing: item.outgoing ?? "0",
        finalStock: item.stock + +item.incoming - +item.outgoing,
      })),
      cashVerify: data.cashVerify?.filter((item) => item.value),
      expenses: data.expenses?.filter((item) => item.name),
      productTransfer: data.productTransfer?.filter((item) => item.name),
      inventory: data.inventory?.filter((item) => item.quantity),
      notes: data.notes,
    };

    await createReportBar({
      data: formateData,
    });

    const updatedTobacco = data?.tobacco?.map((item) => {
      const finalStock =
        item.stock + Number(item.incoming || 0) - Number(item.outgoing || 0);

      return {
        ...item,
        stock: finalStock,
        incoming: "",
        outgoing: "",
      };
    });

    const updatedData = {
      ...data,
      date: new Date(),
      tobacco: updatedTobacco,
      cashVerify: cashVerifyDefault,
      expenses: expensesDefault,
      productTransfer: productTransferDefault,
      inventory: inventoryDefault,
      notes: "",
    };

    resetForm(updatedData);
    toast.success("Бар отчет успешно сохранён !");
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        ...loading
      </div>
    );
  }
  const reset = () => {
    const currentTobacco = form.getValues("tobacco")?.map((item) => ({
      ...item,
      stock: Number(item.stock),
      incoming: "",
      outgoing: "",
    }));

    resetForm({
      ...reportBarSchema.parse({}),
      tobacco: currentTobacco,
    });
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      resetForm={reset}
      resetButton={true}
      className="gap-6"
    >
      <div className="flex w-full justify-end">
        <DatePickerInput
          fieldName="date"
          className="md:w-30 h-8 text-sm w-full text-rd"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[22%_20%_26%_20%] xl:justify-between">
        <TableTobacco />
        <TableExpenses />
        <TableProductsTransfer />
        <TableInventory />
      </div>
      <Textarea
        placeholder="notes ..."
        {...form.register("notes")}
        className="resize-none"
      />

      <TableCashVerify />
    </FormWrapper>
  );
}
