"use client";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  cashVerifyDefault,
  defaultValuesReportBar,
  expensesDefault,
  inventoryDefault,
  productTransferDefault,
} from "./report/schema";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  createReportBar,
  realtimeReportBar,
} from "@/app/actions/report-bar/report-bar-action";
import { Activity, useEffect, useState } from "react";
import { useAbility } from "@/providers/AbilityProvider";
import ReportBarTable from "./report/report-bar-table";
import { TabsContent } from "@/components/ui/tabs";
import BreakTable from "@/features/bar/break-form/break-table";
import PenaltyTable from "@/features/bar/penalty/penalty-table";
import { defaultRemarksValue } from "@/features/bar/penalty/schema";
import { defaultValuesBreak } from "@/features/bar/break-form/schema";
import { createRemarks } from "@/app/actions/remarks/remarks-action";
import { createBreakList } from "@/app/actions/break/break-action";
import { useRealtimeSave } from "@/hooks/use-realtime-save";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { BarFormValues, barSchema } from "./schema";
import { MONTHS } from "@/utils/getMonthDays";
import ModalConfirm from "@/components/modal/ModalConfirm";
import { useSearchParams } from "next/navigation";

export default function BarForm({
  realtimeData,
  employeesName,
}: {
  realtimeData?: BarFormValues;
  employeesName: string[];
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { isBar, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isBar);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<BarFormValues | null>(null);

  const form = useForm<BarFormValues>({
    defaultValues: realtimeData ?? {
      date: new Date(),
      report: defaultValuesReportBar,
      penalty: defaultRemarksValue,
      breakForm: defaultValuesBreak,
    },
    resolver: zodResolver(barSchema) as Resolver<BarFormValues>,
    mode: "onChange",
  });

  const values = useWatch({ control: form.control }) as BarFormValues;

  useRealtimeSave(values, isAdmin, async (data) => {
    if (!data || !form.formState.isDirty) return;
    await realtimeReportBar(data);
    toast.info("Автосохранение всех данных…", { duration: 2000 });
  });

  //submit
  const onSubmit = async (data: BarFormValues) => {
    console.log("Submitting data:", data);

    const { date, report, penalty, breakForm } = data;
    const dateValue = new Date(date);
    const month = MONTHS[dateValue.getMonth()];
    const year = dateValue.getFullYear().toString();
    const day = dateValue.getDate().toLocaleString();
    const uniqueKey = `${year}-${month}`;
    const formateReportData = {
      ...report,
      tobacco: report.tobacco?.map((item) => ({
        ...item,
        stock: item.stock,
        incoming: item.incoming ?? "0",
        outgoing: item.outgoing ?? "0",
        finalStock: item.stock + +item.incoming - +item.outgoing,
      })),
      cashVerify: report.cashVerify?.filter((item) => item.value),
      expenses: report.expenses?.filter((item) => item.name),
      productTransfer: report.productTransfer?.filter((item) => item.name),
      inventory: report.inventory?.filter((item) => item.quantity),
      notes: report.notes,
    };

    const formattedBreakData = {
      day,
      month,
      year,
      uniqueKey,
      rows: breakForm.rows,
    };
    const formattedPenaltyData = {
      remarks: penalty.remarks,
      uniqueKey: uniqueKey,
      month: month,
      year: year,
      day: day,
    };

    await createReportBar(uniqueKey, year, month, {
      day,
      report: formateReportData,
    });
    await createBreakList(formattedBreakData);
    await createRemarks(uniqueKey, formattedPenaltyData);

    const updatedTobacco = report.tobacco?.map((item) => {
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

    // await realtimeReportBar(updatedData).catch(console.error);
    form.reset({
      date: new Date(),
      report: updatedData,
      penalty: defaultRemarksValue,
      breakForm: defaultValuesBreak,
    });

    toast.success("Бар отчет успешно сохранён !");
  };

  const handleFormSubmit = (data: BarFormValues) => {
    setFormDataToSubmit(data);

    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!realtimeData) return;

    form.reset({
      date: realtimeData.date ? new Date(realtimeData.date) : new Date(),
      report: realtimeData.report ?? defaultValuesReportBar,
      penalty: realtimeData.penalty ?? defaultRemarksValue,
      breakForm: realtimeData.breakForm ?? defaultValuesBreak,
    });
  }, [realtimeData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col h-[98vh] p-1"
      >
        <DatePickerInput
          fieldName="date"
          className="text-md text-rd"
          disabled
        />

        <TabsContent value="break">
          <Activity mode={tab === "break" ? "visible" : "hidden"}>
            <BreakTable isDisabled={isDisabled} employeesName={employeesName} />
          </Activity>
        </TabsContent>

        <TabsContent value="penalty">
          <Activity mode={tab === "penalty" ? "visible" : "hidden"}>
            <PenaltyTable isDisabled={isDisabled} />
          </Activity>
        </TabsContent>

        <TabsContent value="report">
          <Activity mode={tab === "report" ? "visible" : "hidden"}>
            <ReportBarTable isDisabled={isDisabled} />
          </Activity>
        </TabsContent>

        <div className="sticky bottom-2 w-full flex justify-start px-4 mt-auto">
          <Button type="submit" className="bg-bl text-white mt-auto">
            Сохранить
          </Button>
          <ModalConfirm
            open={isModalOpen}
            setOpen={setIsModalOpen}
            message="save"
            handleConfirm={async () => {
              if (!formDataToSubmit) return;
              await onSubmit(formDataToSubmit);
              setIsModalOpen(false);
              setFormDataToSubmit(null);
            }}
          />
        </div>
      </form>
    </Form>
  );
}
