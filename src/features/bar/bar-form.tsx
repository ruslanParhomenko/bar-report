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

import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createReportBar,
  realtimeReportBar,
} from "@/app/actions/report-bar/report-bar-action";
import { useEffect, useState } from "react";
import { useAbility } from "@/providers/AbilityProvider";
import ReportBarTable from "./report/report-bar-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreakTable from "@/features/bar/break-form/break-table";
import PenaltyTable from "@/features/bar/penalty/penalty-table";
import {
  defaultRemarksValue,
  RemarksFormData,
} from "@/features/bar/penalty/schema";
import {
  BreakFormData,
  defaultValuesBreak,
} from "@/features/bar/break-form/schema";
import {
  createRemarks,
  realtimeRemarksList,
  updateRemarks,
} from "@/app/actions/remarks/remarks-action";
import {
  createBreakList,
  realtimeBreakList,
} from "@/app/actions/break/break-action";
import { useRealtimeSave } from "@/hooks/use-realtime-save";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { BarFormValues, barSchema } from "./schema";
import { MONTHS } from "@/utils/getMonthDays";

export default function BarForm({
  realtimeData,
  employeesName,
}: {
  realtimeData?: Partial<BarFormValues>;
  employeesName: string[];
}) {
  const { isBar, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isBar);

  console.log("report", realtimeData);

  const form = useForm<BarFormValues>({
    defaultValues: {
      report: defaultValuesReportBar,
      penalty: defaultRemarksValue,
      breakForm: defaultValuesBreak,
    },
    resolver: zodResolver(barSchema) as Resolver<BarFormValues>,
    mode: "onChange",
  });

  const values = useWatch({ control: form.control });

  const reportValues = values?.report;
  const penaltyValues = values?.penalty;
  const breakValues = values?.breakForm;

  useRealtimeSave(reportValues, isBar, async (data) => {
    if (!data) return;
    await realtimeReportBar(data as BarFormValues["report"]);
    toast.info("Автосохранение отчёта…", { duration: 2000 });
  });

  useRealtimeSave(penaltyValues, isBar, async (data) => {
    await realtimeRemarksList(data as RemarksFormData);
    toast.info("Автосохранение журнала…", { duration: 2000 });
  });

  useRealtimeSave(breakValues, isBar, async (data) => {
    await realtimeBreakList(data as BreakFormData);
    toast.info("Автосохранение брейк-листа…", { duration: 2000 });
  });
  //submit
  const onSubmit = async (data: BarFormValues) => {
    console.log("submitData", data);
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

    await realtimeReportBar(updatedData).catch(console.error);
    form.reset({
      date: new Date(),
      report: updatedData,
      penalty: defaultRemarksValue,
      breakForm: defaultValuesBreak,
    });

    toast.success("Бар отчет успешно сохранён !");
  };

  type TabValue = "break" | "penalty" | "report";

  const [tab, setTab] = useState<TabValue>("report");

  const handleTabChange = (value: string) => {
    if (value === "break" || value === "penalty" || value === "report") {
      setTab(value);
    }
  };

  const navItems = [
    { label: "report", value: "report" },
    { label: "break", value: "break" },
    { label: "penalty", value: "penalty" },
  ];

  useEffect(() => {
    if (!realtimeData) return;

    console.log("realtimeData", realtimeData.breakForm);

    form.reset({
      report: realtimeData.report ?? defaultValuesReportBar,
      penalty: realtimeData.penalty ?? defaultRemarksValue,
      breakForm: realtimeData.breakForm ?? defaultValuesBreak,
    });
  }, [realtimeData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-[98vh]"
      >
        <Tabs value={tab} onValueChange={handleTabChange} className="flex-1">
          <div className="flex items-center justify-between my-4 px-4">
            <TabsList className="flex md:gap-2 h-8 w-80">
              {navItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="hover:text-bl cursor-pointer w-1/3"
                >
                  <span className="truncate block w-full text-xs md:text-md text-bl">
                    {item.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            <DatePickerInput fieldName="date" className="text-md text-rd" />
          </div>
          <TabsContent value="break" forceMount>
            <div className={tab !== "break" ? "hidden" : ""}>
              <BreakTable
                isDisabled={isDisabled}
                employeesName={employeesName}
              />
            </div>
          </TabsContent>
          <TabsContent value="penalty" forceMount>
            <div className={tab !== "penalty" ? "hidden" : ""}>
              <PenaltyTable isDisabled={isDisabled} />
            </div>
          </TabsContent>
          <TabsContent value="report" forceMount>
            <div className={tab !== "report" ? "hidden" : ""}>
              <ReportBarTable isDisabled={isDisabled} />
            </div>
          </TabsContent>
        </Tabs>
        <div className="sticky bottom-2 w-full flex justify-start px-4">
          <Button type="submit" className="bg-bl text-white mt-auto">
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  );
}
