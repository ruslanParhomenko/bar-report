"use client";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { getMonthDays } from "@/utils/getMonthDays";

import { SubmitHandler, useForm } from "react-hook-form";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { useAbility } from "@/providers/AbilityProvider";
import { useEffect } from "react";
import {
  AOContextValue,
  createAO,
  updateAO,
} from "@/app/actions/a-o/ao-action";
import { toast } from "sonner";
import { rowsAdvance, rowsPurchaseModa, rowsPurchaseNMB } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { AOFormTypeInput, aoSchema, defaultAOForm } from "./schema";
import { RowRender } from "@/components/table/row-render";
import { calculateRowAOTotals } from "./utils";
import { cn } from "@/lib/utils";

export default function AoForm({
  dataAo,
  month,
  year,
}: {
  dataAo: AOContextValue | null;
  month: string;
  year: string;
}) {
  const monthDays = getMonthDays({ month, year });

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
        rowsPurchaseModa.map((row) => [row.key, makeArray()]),
      ),
      ...Object.fromEntries(
        rowsPurchaseNMB.map((row) => [row.key, makeArray()]),
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

  const rowAOData = dataAo && dataAo.rowAOData;
  const totals = calculateRowAOTotals(rowAOData ?? {});

  const n = (v: unknown) => Number(v) || 0;

  const differenceModa = (
    n(totals.advanceModaByDay) -
    n(totals.purchaseBarByDay) -
    n(totals.purchaseModaByDay) -
    n(totals.ttnBarByDay) -
    n(totals.ttnModaByDay)
  ).toFixed(2);

  const differenceNBM = (
    n(totals.advanceNBMByDay) -
    n(totals.fuelNBMByDay) -
    n(totals.purchaseNBMByDay) -
    n(totals.ttnNBMByDay)
  ).toFixed(2);

  return (
    <FormWrapper form={form} onSubmit={onSubmit} withButtons={isAdmin}>
      <Table>
        <DayByMonthTable month={month} monthDays={monthDays} infoCell={true} />
        <RowRender<AOFormTypeInput, "rowAOData">
          nameField="rowAOData"
          nameLabel="+"
          arrayRows={rowsAdvance}
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />

        <RowRender<AOFormTypeInput, "rowAOData">
          nameField="rowAOData"
          nameLabel="- moda"
          arrayRows={rowsPurchaseModa}
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />

        <RowRender<AOFormTypeInput, "rowAOData">
          nameField="rowAOData"
          nameLabel="- nbm"
          arrayRows={rowsPurchaseNMB}
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />
        <TableBody>
          <TableRow className="h-12">
            <TableCell>
              moda:
              <span
                className={cn(
                  "text-xs pl-2 font-bold",
                  Number(differenceModa) < 0
                    ? "text-red-600"
                    : "text-green-600",
                )}
              >
                {differenceModa}
              </span>
            </TableCell>
            <TableCell>
              nbm:
              <span
                className={cn(
                  "text-xs pl-2 font-bold",
                  Number(differenceNBM) < 0 ? "text-red-600" : "text-green-600",
                )}
              >
                {differenceNBM}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </FormWrapper>
  );
}
