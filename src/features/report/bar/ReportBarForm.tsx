"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { toast } from "sonner";
import {
  cashVerifyDefault,
  defaultValuesReportBar,
  expensesDefault,
  inventoryDefault,
  productTransferDefault,
  ReportBarFormValues,
  reportBarSchema,
} from "./schema";
import TableTobacco from "./TableTobacco";
import TableExpenses from "./TableExpenses";
import TableCashVerify from "./TableCashVerify";
import { SendResetButton } from "@/components/buttons/SendResetButton";
import TableProductsTransfer from "./TableProductsTransfer";
import { Textarea } from "@/components/ui/textarea";
import { TableInventory } from "./TableInventory";
import { createReportBar } from "@/app/actions/archive/reportBarAction";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { useAbility } from "@/providers/AbilityProvider";

export default function ReportBarForm() {
  const { isAdmin } = useAbility();
  const STORAGE_KEY = "report-bar";

  //form
  const form = useForm<ReportBarFormValues>({
    defaultValues: defaultValuesReportBar,
    resolver: yupResolver(reportBarSchema),
  });
  // localstorage
  const { isLoaded, resetForm } = useLocalStorageForm(form, STORAGE_KEY);

  //submit
  const onSubmit: SubmitHandler<ReportBarFormValues> = async (data) => {
    const formateData = {
      ...data,
      date: new Date(data.date),
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
      const finalStock = item.stock + +item.incoming - +item.outgoing;

      return {
        ...item,
        stock: finalStock,
        incoming: "",
        outgoing: "",
      };
    });

    const updatedData: ReportBarFormValues = {
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

  function mergeByIndex<T>(defaults: T[], data?: T[]) {
    return defaults.map((item, index) => data?.[index] ?? item);
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        ...loading
      </div>
    );
  }
  const reset = () => {
    resetForm(defaultValuesReportBar);
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col h-[90vh] gap-6"
    >
      <div className="flex w-full justify-end">
        <DatePickerInput
          fieldName="date"
          className="md:w-30 h-8 text-sm w-full text-rd"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[22%_20%_26%_20%] xl:justify-between ">
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
      <div className="mt-auto">
        <SendResetButton resetForm={reset} reset={isAdmin} />
      </div>
    </FormWrapper>
  );
}
