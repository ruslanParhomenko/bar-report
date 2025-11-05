"use client";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useEffect } from "react";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { useAbility } from "@/providers/AbilityProvider";
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
import { FetchDataButton } from "@/components/buttons/FetchDataButton";
import TableProductsTransfer from "./TableProductsTransfer";
import { Textarea } from "@/components/ui/textarea";
import TabelInventory from "./TabelInventory";
import { createReportBar } from "@/app/actions/archive/reportBarAction";

export default function ReportBarForm() {
  const STORAGE_KEY = "report-bar";
  const { isBar, isAdmin, isUser, isCucina, isObserver } = useAbility();
  const isDisabled = isObserver || isCucina || isBar;

  // local storage
  const { getValue, setValue: setLocalStorage } =
    useLocalStorageForm<ReportBarFormValues>(STORAGE_KEY);

  //form
  const form = useForm<ReportBarFormValues>({
    defaultValues: {
      ...defaultValuesReportBar,
      ...getValue(),
    },
    resolver: yupResolver(
      reportBarSchema
    ) as unknown as Resolver<ReportBarFormValues>,
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setLocalStorage(value as ReportBarFormValues);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setLocalStorage]);

  //reset
  const resetForm = () => {
    const currentValues = form.getValues();
    const resetTobacco = currentValues?.tobacco?.map((item) => ({
      ...item,
      incoming: "",
      outgoing: "",
    }));

    form.reset({
      ...currentValues,
      date: new Date().toDateString(),
      tobacco: resetTobacco as TobaccoSchemaType,
      cashVerify: cashVerifyDefault,
      expenses: expensesDefault,
      productTransfer: productTransferDefault,
      inventory: inventoryDefault,
      notes: "",
    });

    setLocalStorage({
      ...currentValues,
      date: new Date().toDateString(),
      tobacco: resetTobacco as TobaccoSchemaType,
      cashVerify: cashVerifyDefault,
      expenses: expensesDefault,
      productTransfer: productTransferDefault,
      inventory: inventoryDefault,
      notes: "",
    });
    toast.success("Форма успешно сброшена !");
  };

  //submit
  const handleSubmit: SubmitHandler<ReportBarFormValues> = async (data) => {
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
      date: new Date().toDateString(),
      tobacco: updatedTobacco as TobaccoSchemaType,
      cashVerify: cashVerifyDefault,
      expenses: expensesDefault,
      productTransfer: productTransferDefault,
      inventory: inventoryDefault,
      notes: "",
    };

    form.reset(updatedData);
    toast.success("Бар отчет успешно сохранён !");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="md:pl-2">
        <div className="flex items-center gap-4 justify-between ">
          <DatePickerInput fieldName="date" />
          {(isAdmin || isUser) && <FetchDataButton isDisabled={isDisabled} />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[25%_70%] md:gap-15  pt-2">
          <TableTobacco />
          <div className="grid md:grid-cols-[65%_30%] gap-2">
            <div>
              <div className="grid  md:grid-cols-[40%_55%] md:gap-4 px-1 pb-2">
                <TableExpenses />
                <TableProductsTransfer />
              </div>
              <div className="px-4 py-4">
                <Textarea
                  placeholder="notes ..."
                  {...form.register("notes")}
                  disabled={isObserver}
                  className="resize-none"
                />
              </div>
            </div>
            <TabelInventory />
          </div>
        </div>

        <TableCashVerify />
        <SendResetButton resetForm={resetForm} reset={true} />
      </form>
    </Form>
  );
}
