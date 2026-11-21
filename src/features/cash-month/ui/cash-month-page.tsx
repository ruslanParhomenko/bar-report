"use client";

import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { CashMonthFooterTable } from "@/features/cash-month/ui/cash-month-footer";
import CashInfo from "@/features/cash-month/ui/cash-month-info";
import { GetAoData } from "@/features/finance/a-o/model/type";
import { createCash } from "@/features/finance/cash/actions/create-cash";
import { ROW_CASH_DATA } from "@/features/finance/cash/model/constants";
import type { GetCashData } from "@/features/finance/cash/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CashForm,
  cashFormSchema,
  defaultCashForm,
} from "../../finance/cash/model/schema";
import { CashMonthBodyTable } from "./cash-month-body";
import CashMonthHeaderTable from "./shared/cash-month-header";

export default function CashMonthPage({
  dataAo,
  dataCashByMonth,
}: {
  dataAo: GetAoData | null;
  dataCashByMonth: GetCashData | null;
}) {
  const todayDay = new Date().getDate();

  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();

  const { monthDays, month, year } = useMonthDays();

  const dataCash = dataCashByMonth?.cashData;

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
      ROW_CASH_DATA.map((row) => [row.key, Array(monthDays.length).fill("")]),
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
      <Table className="mt-4 table-auto">
        <CashMonthHeaderTable
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        <CashMonthBodyTable
          data={ROW_CASH_DATA}
          selectedDay={selectedDay}
          isEdit={isEdit}
        />
        <CashMonthFooterTable />
        <CashInfo />
      </Table>
    </FormWrapper>
  );
}
