"use client";

import { useAbility } from "@/providers/AbilityProvider";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CashFormType, cashSchema, defaultCashForm } from "./schema";
import { toast } from "sonner";

import { useMemo, useEffect } from "react";
import { getMonthDays } from "@/utils/getMonthDays";
import { Table, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { CashBodyTable } from "./CashBodyTable";
import { saveCashForm } from "@/app/actions/cash/cashAction";
import { CashHeaderTable } from "./CashHeaderTable";
import { FilterDataByMonth } from "@/components/filter/FilterDataByMonth";
import { useCash } from "@/providers/CashProvider";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CashFooterTable } from "./CashFooterTable";

export function PageCash() {
  // get data
  const dataCash = useCash();

  const { isAdmin, isManager, isCash } = useAbility();
  const isDisabled = !isAdmin && !isManager && !isCash;

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
      cashByDay: makeArray(),
      chipsByDay: makeArray(),
      differenceByDay: makeArray(),
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
    await saveCashForm(data);

    toast.success("Форма сохранена успешно!");
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
      <FilterDataByMonth disabled={isDisabled} withButton={true} />
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
