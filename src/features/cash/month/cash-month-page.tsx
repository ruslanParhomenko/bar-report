"use client";

import { GetAoData } from "@/app/actions/a-o/ao-action";
import { createCash, GetCashData } from "@/app/actions/cash/cash-action";
import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { rowCashBar } from "../constants";
import type { CashForm } from "../schema";
import { cashFormSchema, defaultCashForm } from "../schema";
import { CashMonthBodyTable } from "./cash-month-body";
import { CashMonthFooterTable } from "./cash-month-footer";
import CashMonthHeaderTable from "./cash-month-header";
import CashInfo from "./cash-month-info";

export default function CashMonthPage({
  dataAo,
  dataCashYear,
}: {
  dataAo: GetAoData | null;
  dataCashYear: GetCashData[] | null;
}) {
  const todayDay = new Date().getDate();

  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();

  const { monthDays, month, year } = useMonthDays();

  const dataCash = dataCashYear?.find((cash) => cash.id === month)?.cashData;

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
      form.reset(dataCash as CashForm);
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
      const totalTTNModa = sumArray(
        dataAo.aoData.rowAOData.ttnModaByDay as string[],
      );
      const totalTTNBar = sumArray(
        dataAo.aoData.rowAOData.ttnBarByDay as string[],
      );
      form.setValue("ao_532", (totalTTNModa + totalTTNBar).toFixed(2));
    }
  }, [dataCash, dataAo, month, year]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Table className="mt-4 table-fixed">
        <CashMonthHeaderTable
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        <CashMonthBodyTable
          data={rowCashBar}
          selectedDay={selectedDay}
          isEdit={isEdit}
        />
        <CashMonthFooterTable />
        <CashInfo isEdit={isEdit} />
      </Table>
    </FormWrapper>
  );
}
