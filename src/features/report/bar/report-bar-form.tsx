"use client";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  barSchema,
  defaultValuesReportBar,
  ReportBarFormValues,
} from "./schema";

import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";

import { realtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import { useEffect, useState } from "react";
import { useAbility } from "@/providers/AbilityProvider";
import ReportBarTable from "./report-bar-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreakTable from "@/features/break/break-table";
import PenaltyTable from "@/features/penalty/penalty-table";
import {
  defaultRemarksValue,
  RemarksFormData,
} from "@/features/penalty/schema";
import { BreakFormData, defaultValuesBreak } from "@/features/break/schema";
import { realtimeRemarksList } from "@/app/actions/remarks/remarks-action";
import { realtimeBreakList } from "@/app/actions/break/break-action";
import { useRealtimeSave } from "@/hooks/use-realtime-save";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export type RealtimeData = {
  report: ReportBarFormValues;
  penalty: RemarksFormData;
  breakForm: BreakFormData;
};

export default function BarForm({
  realtimeData,
}: {
  realtimeData?: Partial<RealtimeData>;
}) {
  const { isBar, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isBar);

  console.log("report", realtimeData);

  const form = useForm<RealtimeData>({
    defaultValues: {
      report: defaultValuesReportBar,
      penalty: defaultRemarksValue,
      breakForm: defaultValuesBreak,
    },
    resolver: zodResolver(barSchema) as Resolver<RealtimeData>,
    mode: "onChange",
  });

  const values = useWatch({ control: form.control });

  const reportValues = values?.report;
  const penaltyValues = values?.penalty;
  const breakValues = values?.breakForm;

  useRealtimeSave(reportValues, isBar, async (data) => {
    if (!data) return;
    await realtimeReportBar(data as RealtimeData["report"]);
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
  const onSubmit = async (data: RealtimeData) => {
    console.log("submitData", data);
    // const { date, ...rest } = data;
    // const dateValue = new Date(date);
    // const month = MONTHS[dateValue.getMonth()];
    // const year = dateValue.getFullYear().toString();
    // const day = dateValue.getDate().toLocaleString();
    // const uniqueKey = `${year}-${month}`;
    // const formateData = {
    //   ...rest,
    //   tobacco: data.tobacco?.map((item) => ({
    //     ...item,
    //     stock: item.stock,
    //     incoming: item.incoming ?? "0",
    //     outgoing: item.outgoing ?? "0",
    //     finalStock: item.stock + +item.incoming - +item.outgoing,
    //   })),
    //   cashVerify: data.cashVerify?.filter((item) => item.value),
    //   expenses: data.expenses?.filter((item) => item.name),
    //   productTransfer: data.productTransfer?.filter((item) => item.name),
    //   inventory: data.inventory?.filter((item) => item.quantity),
    //   notes: data.notes,
    // };

    // await createReportBar(uniqueKey, year, month, { day, report: formateData });

    // const updatedTobacco = data?.tobacco?.map((item) => {
    //   const finalStock =
    //     item.stock + Number(item.incoming || 0) - Number(item.outgoing || 0);

    //   return {
    //     ...item,
    //     stock: finalStock,
    //     incoming: "",
    //     outgoing: "",
    //   };
    // });

    // const updatedData = {
    //   ...data,
    //   date: new Date(),
    //   tobacco: updatedTobacco,
    //   cashVerify: cashVerifyDefault,
    //   expenses: expensesDefault,
    //   productTransfer: productTransferDefault,
    //   inventory: inventoryDefault,
    //   notes: "",
    // };

    // await realtimeReportBar(updatedData).catch(console.error);
    // form.reset({
    //   report: updatedData,
    //   penalty: defaultRemarksValue,
    //   break: defaultValuesBreak,
    // });

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
        className="flex flex-col h-[93vh]"
      >
        <Tabs value={tab} onValueChange={handleTabChange}>
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
          <TabsContent value="break" forceMount>
            <div className={tab !== "break" ? "hidden" : ""}>
              <BreakTable />
            </div>
          </TabsContent>
          <TabsContent value="penalty" forceMount>
            <div className={tab !== "penalty" ? "hidden" : ""}>
              <PenaltyTable />
            </div>
          </TabsContent>
          <TabsContent value="report" forceMount>
            <div className={tab !== "report" ? "hidden" : ""}>
              <ReportBarTable />
            </div>
          </TabsContent>
        </Tabs>
        <div className="sticky bottom-2 w-full flex justify-end px-4">
          <Button type="submit" className="bg-bl text-white">
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  );
}
