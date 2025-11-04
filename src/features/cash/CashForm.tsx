"use client";

import { Form } from "@/components/ui/form";
import { useAbility } from "@/providers/AbilityProvider";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CashFormType, cashSchema, defaultCashForm } from "./schema";
import { toast } from "sonner";
import FilterHeader from "../tips/FilterHeader";
import { useMemo, useEffect, use } from "react";
import { getMonthDays } from "@/utils/getMonthDays";
import { Table } from "@/components/ui/table";
import TableHeaderData from "../tips/TableHeader";
import TableBodyCash from "./TableBodyCash";
import { saveCashForm } from "@/app/actions/cash/cashAction";
import TableHeaderCash from "./TableHeaderCash";

export default function CashForm({ initialData }: { initialData: any[] }) {
  const { isAdmin, isMngr, isCash } = useAbility();
  const isDisabled = !isAdmin && !isMngr && !isCash;

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
    if (!monthDays.length && initialData) return;

    const newRowCashData = {
      tipsByDay: Array(monthDays.length).fill(""),
      cashByDay: Array(monthDays.length).fill(""),
      chipsByDay: Array(monthDays.length).fill(""),
      differenceByDay: Array(monthDays.length).fill(""),
      visaCasinoByDay: Array(monthDays.length).fill(""),
    };

    form.setValue("rowCashData", newRowCashData);
  }, [monthDays, form]);

  // Submit handler
  const onSubmit: SubmitHandler<CashFormType> = async (data) => {
    await saveCashForm(data);

    toast.success("Форма сохранена успешно!");
  };

  useEffect(() => {
    if (!initialData || !month || !year) return;

    const unique_id = `${year}-${month}`;
    const dataForMonth = initialData.find(
      (item: any) => item.unique_id === unique_id
    );

    if (dataForMonth) {
      console.log("dataForMonth.form_data:", dataForMonth.form_data);
      form.reset({
        ...dataForMonth.form_data,
        id: dataForMonth.id,
      } as CashFormType);
    }
  }, [month, year, initialData]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="flex flex-col"
      >
        <FilterHeader isDisabled={isDisabled} />
        <Table className="md:table-fixed">
          <TableHeaderCash monthDays={monthDays} month={month} />
          <TableBodyCash
            form={form}
            monthDays={monthDays}
            isDisabled={isDisabled}
          />
        </Table>
      </form>
    </Form>
  );
}
