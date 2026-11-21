"use client";
import type { GetAoData } from "@/features/finance/a-o/model/type";
import { createCash } from "@/features/finance/cash/actions/create-cash";
import { ROW_CASH_DATA } from "@/features/finance/cash/model/constants";
import {
  CashForm,
  cashFormSchema,
  defaultCashForm,
} from "@/features/finance/cash/model/schema";
import type { GetCashData } from "@/features/finance/cash/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const sumArray = (arr: string[] = []) =>
  arr.reduce((acc, num) => acc + Number(num || 0), 0);

const getAo532 = (dataAo: GetAoData) => {
  const { ttnModaByDay, ttnBarByDay } = dataAo.aoData.rowAOData;
  return (
    sumArray(ttnModaByDay as string[]) + sumArray(ttnBarByDay as string[])
  ).toFixed(2);
};

export function useCashForm({
  dataCashByMonth,
  dataAoByMonth,
}: {
  dataCashByMonth: GetCashData | null;
  dataAoByMonth: GetAoData | null;
}) {
  const { setIsEdit } = useEdit();
  const { monthDays, month, year } = useMonthDays();

  const form = useForm<CashForm>({
    resolver: zodResolver(cashFormSchema),
    defaultValues: defaultCashForm,
  });

  const dataCash = dataCashByMonth?.cashData;

  useEffect(() => {
    const values: CashForm = dataCash
      ? (dataCash as CashForm)
      : {
          rowCashData: Object.fromEntries(
            ROW_CASH_DATA.map((row) => [
              row.key,
              Array(monthDays.length).fill(""),
            ]),
          ),
          start_241: "",
          ao_532: "",
          z_531: "",
        };

    form.reset(
      dataAoByMonth ? { ...values, ao_532: getAo532(dataAoByMonth) } : values,
    );
  }, [dataCash, dataAoByMonth, month, year, monthDays.length, form]);

  const onSubmit: SubmitHandler<CashForm> = async (data) => {
    try {
      await createCash({ cashData: data, month, year });
      toast.success("Форма сохранена успешно!");
    } catch {
      toast.error("Ошибка при сохранении формы!");
    }
    setIsEdit(false);
  };

  return { form, onSubmit };
}
