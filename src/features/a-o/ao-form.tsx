"use client";

import { getMonthDays } from "@/utils/get-month-days";

import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { useAbility } from "@/providers/ability-provider";
import { useEffect, useMemo } from "react";
import {
  AOContextValue,
  createAO,
  updateAO,
} from "@/app/actions/a-o/ao-action";
import { toast } from "sonner";
import { rowsAdvance, rowsPurchaseModa, rowsPurchaseNMB } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { AOFormTypeInput, aoSchema } from "./schema";
import { RowRender } from "@/components/table/row-render";
import { calculateRowAOTotals } from "./utils";
import { cn } from "@/lib/utils";
import FormInput from "@/components/wrapper/form";

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
    defaultValues: dataAo ? dataAo : {},
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
    } else {
      await createAO(formatData);
      toast.success("AO успешно создан!");
    }
  };
  const initialRowData = useMemo(() => {
    const makeArray = () => Array(monthDays.length).fill("");
    return {
      ...Object.fromEntries(rowsAdvance.map((row) => [row.key, makeArray()])),
      ...Object.fromEntries(
        rowsPurchaseModa.map((row) => [row.key, makeArray()]),
      ),
      ...Object.fromEntries(
        rowsPurchaseNMB.map((row) => [row.key, makeArray()]),
      ),
    };
  }, [monthDays.length, rowsAdvance, rowsPurchaseModa, rowsPurchaseNMB]);

  useEffect(() => {
    if (dataAo) {
      form.reset({ ...dataAo });
    } else {
      form.setValue("rowAOData", initialRowData);
    }
  }, [dataAo, form, initialRowData]);

  const rowAOData = useWatch({
    control: form.control,
    name: "rowAOData",
  });
  const totals = calculateRowAOTotals(rowAOData ?? {});

  const n = (v: unknown) => Number(v) || 0;

  const differenceModa = (
    n(totals.advanceModaByDay) -
    n(totals.purchaseBarByDay) -
    n(totals.purchaseModaByDay) -
    n(totals.purchaseCookByDay) -
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
    <FormInput form={form} onSubmit={onSubmit} withButtons={isAdmin}>
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
            <TableCell colSpan={4}>
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
            <TableCell colSpan={4}>
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
    </FormInput>
  );
}
