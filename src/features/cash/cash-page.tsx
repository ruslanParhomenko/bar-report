"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { cashFormSchema, defaultCashForm } from "./schema";
import type { CashForm } from "./schema";
import { createCash, GetCashData } from "@/app/actions/cash/cash-action";
import { toast } from "sonner";
import { useAbility } from "@/providers/ability-provider";
import { CashFooterTable } from "./cash-footer";
import { useEffect, useRef, useState } from "react";
import { Table } from "@/components/ui/table";
import { AOContextValue } from "@/app/actions/a-o/ao-action";
import { zodResolver } from "@hookform/resolvers/zod";
import CashInfo from "./cash-info";
import { rowCashBar } from "./constants";
import { useMonthDays } from "@/providers/month-days-provider";
import { Form } from "@/components/ui/form";
import CashHeaderTable from "./cash-header";
import { TipsBodyTable } from "./cash-body";

export default function CashPage({
  dataAo,
  dataCash,
}: {
  dataAo: AOContextValue | null;
  dataCash: GetCashData | null;
}) {
  const { isAdmin } = useAbility();
  const isDisabled = !isAdmin;

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const [isEdit, setIsEdit] = useState(false);
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
  };

  const initialRowData = {
    ...Object.fromEntries(
      rowCashBar.map((row) => [row.key, Array(monthDays.length).fill("")]),
    ),
  };

  console.log(initialRowData);

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

  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div ref={ref} data-screenshot-root="true" className="mt-4">
          <Table className="table-fixed">
            <CashHeaderTable
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              setIsEdit={setIsEdit}
              isEdit={isEdit}
              ref={ref}
              disabled={isDisabled}
            />

            <TipsBodyTable
              data={rowCashBar}
              selectedDay={selectedDay}
              isEdit={isEdit}
            />
            <CashFooterTable />
            <CashInfo isEdit={isEdit} />
          </Table>
        </div>
      </form>
    </Form>
  );
}
