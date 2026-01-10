"use client";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { getMonthDays } from "@/utils/getMonthDays";

import { SubmitHandler, useForm } from "react-hook-form";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { Table } from "@/components/ui/table";

import { useAbility } from "@/providers/AbilityProvider";
import { useEffect } from "react";
import { SendResetButton } from "@/components/buttons/SendResetButton";
import {
  AOContextValue,
  createAO,
  updateAO,
} from "@/app/actions/a-o/ao-action";
import { toast } from "sonner";
import AoRenderRow from "./ao-render-row";
import { rowsAdvance, rowsPurchaseModa, rowsPurchaseNMB } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { AOFormTypeInput, aoSchema, defaultAOForm } from "./schema";

export default function AoForm({
  dataAo,
  monthDays,
  month,
  year,
}: {
  dataAo: AOContextValue | null;
  monthDays: ReturnType<typeof getMonthDays>;
  month: string;
  year: string;
}) {
  const { isAdmin, isCash } = useAbility();
  const isDisabled = !isAdmin && !isCash;

  const form = useForm<AOFormTypeInput>({
    resolver: zodResolver(aoSchema),
    defaultValues: aoSchema.parse(dataAo ?? {}),
  });

  const onSubmit: SubmitHandler<AOFormTypeInput> = async (data) => {
    const formatData = {
      ...data,
      uniqueKey: `${year}-${month}`,
      month: month as string,
      year: year as string,
    };
    if (dataAo?.id) {
      await updateAO(dataAo.id as string, formatData);
      toast.success("AO успешно обновлён!");

      return;
    } else {
      await createAO(formatData);
      toast.success("AO успешно создан!");

      form.reset(defaultAOForm);
      return;
    }
  };
  useEffect(() => {
    if (dataAo) return;

    const makeArray = () => Array(monthDays.length).fill("");
    const newRowCashData = {
      ...Object.fromEntries(rowsAdvance.map((row) => [row.key, makeArray()])),
      ...Object.fromEntries(
        rowsPurchaseModa.map((row) => [row.key, makeArray()])
      ),
      ...Object.fromEntries(
        rowsPurchaseNMB.map((row) => [row.key, makeArray()])
      ),
    };

    form.setValue("rowAOData", newRowCashData);
  }, [dataAo, month, year, form]);
  useEffect(() => {
    if (!dataAo) return;

    form.reset({
      ...dataAo,
    });
  }, [dataAo, month, year, form]);

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col h-[90vh] w-full"
    >
      <Table>
        <DayByMonthTable month={month} monthDays={monthDays} />
        <AoRenderRow
          nameLabel="+"
          arrayRows={rowsAdvance}
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />

        <AoRenderRow
          nameLabel="- moda"
          arrayRows={rowsPurchaseModa}
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />

        <AoRenderRow
          nameLabel="- nbm"
          arrayRows={rowsPurchaseNMB}
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />
      </Table>
      {isAdmin && <SendResetButton />}
    </FormWrapper>
  );
}
