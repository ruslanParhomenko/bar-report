"use client";

import { AOContextValue } from "@/app/actions/a-o/ao-action";
import { createCash, GetCashData } from "@/app/actions/cash/cash-action";
import { Form } from "@/components/ui/form";
import { Table } from "@/components/ui/table";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { TipsBodyTable } from "./cash-body";
import { CashFooterTable } from "./cash-footer";
import CashHeaderTable from "./cash-header";
import CashInfo from "./cash-info";
import { rowCashBar } from "./constants";
import type { CashForm } from "./schema";
import { cashFormSchema, defaultCashForm } from "./schema";

export default function CashPage({
  dataAo,
  dataCash,
}: {
  dataAo: AOContextValue | null;
  dataCash: GetCashData | null;
}) {
  const pathname = usePathname();
  const formId = pathname.split("/").pop() || "";

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();
  const { monthDays, month, year } = useMonthDays();

  // form
  const form = useForm<CashForm>({
    resolver: zodResolver(cashFormSchema),
    defaultValues: defaultCashForm,
  });

  // submit
  const onSubmit: SubmitHandler<CashForm> = async (data) => {
    const formattedData = {
      cashData: data,
      month,
      year,
    };
    try {
      await createCash(formattedData);
      toast.success("Форма сохранена успешно!");
    } catch (error) {
      toast.error("Ошибка при сохранении формы!");
    }
    setIsEdit(false);
  };

  const initialRowData = {
    ...Object.fromEntries(
      rowCashBar.map((row) => [row.key, Array(monthDays.length).fill("")]),
    ),
  };

  // reset
  useEffect(() => {
    if (dataCash) {
      form.reset(dataCash.cashData as CashForm);
    } else {
      form.reset({
        rowCashData: initialRowData,
        start_241: "",
        ao_532: "",
        z_531: "",
      });
    }
    if (dataAo) {
      const sumArray = (arr: string[] = []) =>
        arr.reduce((acc, num) => acc + Number(num || 0), 0);
      const totalTTNModa = sumArray(dataAo.rowAOData.ttnModaByDay as string[]);
      const totalTTNBar = sumArray(dataAo.rowAOData.ttnBarByDay as string[]);
      form.setValue("ao_532", (totalTTNModa + totalTTNBar).toFixed(2));
    }
  }, [dataCash, dataAo, month, year]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
        <Table className="mt-4 table-fixed">
          <CashHeaderTable
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />

          <TipsBodyTable
            data={rowCashBar}
            selectedDay={selectedDay}
            isEdit={isEdit}
          />
          <CashFooterTable />
          <CashInfo isEdit={isEdit} />
        </Table>
      </form>
    </Form>
  );
}
