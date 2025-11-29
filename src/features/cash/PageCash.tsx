"use client";

import { useAbility } from "@/providers/AbilityProvider";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CashFormType, cashSchema, defaultCashForm } from "./schema";
import { toast } from "sonner";

import { useMemo, useEffect, useRef } from "react";
import { getMonthDays } from "@/utils/getMonthDays";
import { Table } from "@/components/ui/table";
import { CashBodyTable } from "./CashBodyTable";
import { saveCashForm } from "@/app/actions/cash/cashAction";
import { CashHeaderTable } from "./CashHeaderTable";
import { FilterDataByMonth } from "@/components/filter/FilterDataByMonth";
import { useCash } from "@/providers/CashProvider";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { CashFooterTable } from "./CashFooterTable";
import { sendNotificationEmail } from "@/app/actions/mail/sendNotificationEmail";

export function PageCash() {
  // get data
  const dataCash = useCash();
  const { isAdmin, isCash } = useAbility();
  const isDisabled = !isAdmin && !isCash;

  const form = useForm<CashFormType>({
    resolver: yupResolver(cashSchema),
    defaultValues: {
      ...defaultCashForm,
    },
  });

  const month = form.watch("month");
  const year = form.watch("year");

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  useEffect(() => {
    if (!monthDays.length && dataCash) return;

    const makeArray = () => Array(monthDays.length).fill("");

    const newRowCashData = {
      tipsByDay: makeArray(),
      chipsByDay: makeArray(),
      visaCasinoByDay: makeArray(),
      cashBarByDay: makeArray(),
      visaBarByDay: makeArray(),
      banquetBarByDay: makeArray(),
      visaCasinoBarByDay: makeArray(),
      cash: makeArray(),
    };

    form.setValue("rowCashData", newRowCashData);
  }, [monthDays, form]);

  // submit
  const onSubmit: SubmitHandler<CashFormType> = async (data) => {
    try {
      await saveCashForm(data);
      toast.success("Форма сохранена успешно!");
      if (isCash) {
        await sendNotificationEmail({
          text: `${(data?.rowCashData?.tipsByDay as string[])?.join(",")}
          ${(data?.rowCashData?.chipsByDay as string[])?.join(",")}
          ${(data?.rowCashData?.visaCasinoByDay as string[])?.join(",")}
          ${(data?.rowCashData?.cashBarByDay as string[])?.join(",")}
          ${(data?.rowCashData?.visaBarByDay as string[])?.join(",")}
          ${(data?.rowCashData?.banquetBarByDay as string[])?.join(",")}
         }
       `,
        });
      }
    } catch (error) {
      toast.error("Ошибка при сохранении формы!");
    }
  };

  useEffect(() => {
    if (!dataCash || !month || !year) return;

    const unique_id = `${year}-${month}`;
    const dataForMonth = dataCash.find(
      (item: any) => item.unique_id === unique_id
    );

    if (dataForMonth) {
      form.reset({
        ...dataForMonth.form_data,
      } as CashFormType);
    }
  }, [month, year, dataCash]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <FilterDataByMonth
        disabled={isDisabled}
        withButton={true}
        onConfirmSave={() => form.handleSubmit(onSubmit)()}
      />
      <Table className="md:table-fixed">
        <CashHeaderTable monthDays={monthDays} month={month} />
        <CashBodyTable
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />
        <CashFooterTable monthDays={monthDays} form={form} />
      </Table>
    </FormWrapper>
  );
}
