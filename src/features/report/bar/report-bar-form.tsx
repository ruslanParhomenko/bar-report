"use client";
import { Resolver, useForm, useWatch } from "react-hook-form";
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
import TableTobacco from "./tobacco-table";
import TableExpenses from "./expenses-table";
import TableCashVerify from "./cash-table";
import TableProductsTransfer from "./transfer-table";
import { Textarea } from "@/components/ui/textarea";
import { TableInventory } from "./inventory-table";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { MONTHS } from "@/utils/getMonthDays";
import {
  createReportBar,
  realtimeReportBar,
} from "@/app/actions/report-bar/report-bar-action";
import { useEffect, useState } from "react";
import { useAbility } from "@/providers/AbilityProvider";
import ReportBarTable from "./report-bar-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreakTable from "@/features/break/break-table";
import PenaltyTable from "@/features/penalty/penalty-table";

export default function ReportBarForm({
  realtimeData,
}: {
  realtimeData?: ReportBarFormValues;
}) {
  const { isBar, isAdmin } = useAbility();
  const isDisabled = !(isAdmin || isBar);

  const form = useForm<ReportBarFormValues>({
    defaultValues: realtimeData ? realtimeData : defaultValuesReportBar,
    resolver: zodResolver(reportBarSchema) as Resolver<ReportBarFormValues>,
  });

  const reportValues = useWatch({
    control: form.control,
  });

  useEffect(() => {
    if (!isBar) return;
    const timeoutRef = { current: null as NodeJS.Timeout | null };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const data = form.getValues() as ReportBarFormValues;

      realtimeReportBar(data).catch(console.error);
      toast.info("Автосохранение отчёта ...", { duration: 3000 });
    }, 6000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reportValues]);
  //submit
  const onSubmit = async (data: ReportBarFormValues) => {
    const { date, ...rest } = data;
    const dateValue = new Date(date);
    const month = MONTHS[dateValue.getMonth()];
    const year = dateValue.getFullYear().toString();
    const day = dateValue.getDate().toLocaleString();
    const uniqueKey = `${year}-${month}`;
    const formateData = {
      ...rest,
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

    await createReportBar(uniqueKey, year, month, { day, report: formateData });

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

    await realtimeReportBar(updatedData).catch(console.error);
    form.reset(updatedData);

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

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="p-2"
      disabled={isDisabled}
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
    </FormWrapper>
  );
}
