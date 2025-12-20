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
  TobaccoSchemaType,
} from "./schema";
import TableTobacco from "./TableTobacco";
import TableExpenses from "./TableExpenses";
import TableCashVerify from "./TableCashVerify";
import { SendResetButton } from "@/components/buttons/SendResetButton";
import TableProductsTransfer from "./TableProductsTransfer";
import { Textarea } from "@/components/ui/textarea";
import { TableInventory } from "./TableInventory";
import {
  createReportBar,
  updateReportBar,
} from "@/app/actions/archive/reportBarAction";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { ReportBarData } from "@/constants/type";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportBarForm({ report }: { report?: ReportBarData }) {
  const STORAGE_KEY = report ? `report-bar-${report.id}` : "report-bar";

  const router = useRouter();

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
        stock: Number(item.stock || 0),
        incoming: Number(item.incoming || 0),
        outgoing: Number(item.outgoing || 0),
        finalStock: String(
          Number(item.stock || 0) +
            Number(item.incoming || 0) -
            Number(item.outgoing || 0)
        ),
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
        Number(item.stock ?? 0) +
        Number(item.incoming ?? 0) -
        Number(item.outgoing ?? 0);

      return {
        ...item,
        stock: String(finalStock),
        incoming: "",
        outgoing: "",
      };
    });

    const updatedData: ReportBarFormValues = {
      ...data,
      date: new Date(),
      tobacco: updatedTobacco as TobaccoSchemaType,
      cashVerify: cashVerifyDefault,
      expenses: expensesDefault,
      productTransfer: productTransferDefault,
      inventory: inventoryDefault,
      notes: "",
    };

    resetForm(updatedData);
    toast.success("Бар отчет успешно сохранён !");
  };

  const onUpdate: SubmitHandler<ReportBarData> = async (data) => {
    if (!report?.id) return;
    await updateReportBar({ data });
    toast.success("Report updated successfully");
    router.back();
  };

  useEffect(() => {
    if (report) {
      form.reset(report as any);
    }
  }, [report]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        ...loading
      </div>
    );
  }

  return (
    <FormWrapper
      form={form}
      onSubmit={report ? onUpdate : onSubmit}
      className="flex flex-col h-[90vh] gap-14"
    >
      <div className="flex w-full justify-end">
        <DatePickerInput
          fieldName="date"
          className="md:w-30 h-8 text-sm w-full text-rd"
        />
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-[20%_22%_28%_22%] md:gap-10">
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
        <SendResetButton
          resetForm={form.reset}
          reset={true}
          returnButton={!!report}
        />
      </div>
    </FormWrapper>
  );
}
