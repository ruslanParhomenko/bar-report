"use client";

import { Table } from "@/components/ui/table";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { createAO, GetAoData } from "@/app/actions/a-o/ao-action";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { rowsAdvance, rowsPurchaseModa, rowsPurchaseNMB } from "../constants";
import { AoForm, aoSchema } from "../schema";
import { calculateRowAOTotals } from "../utils";
import AoBodyTable from "./ao-body";
import AoFooterTable from "./ao-footer";
import AoHeaderTable from "./ao-header";

export default function AoMonthPage({ dataAo }: { dataAo: GetAoData | null }) {
  const { monthDays, month, year } = useMonthDays();

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();

  // form
  const form = useForm<AoForm>({
    resolver: zodResolver(aoSchema),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<AoForm> = async (data) => {
    const formatData = {
      aoData: data,
      month,
      year,
    };
    try {
      await createAO(formatData);
      toast.success("AO успешно обновлён!");
    } catch (error) {
      toast.error("Ошибка при сохранении формы!");
    }

    setIsEdit(false);
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
      form.reset(dataAo.aoData);
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
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Table className="mt-4">
        <AoHeaderTable
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <AoBodyTable
          data={rowsAdvance}
          selectedDay={selectedDay}
          isEdit={isEdit}
          fieldName="rowAOData"
        />
        <AoBodyTable
          data={rowsPurchaseModa}
          selectedDay={selectedDay}
          isEdit={isEdit}
          fieldName="rowAOData"
        />
        <AoBodyTable
          data={rowsPurchaseNMB}
          selectedDay={selectedDay}
          isEdit={isEdit}
          fieldName="rowAOData"
        />
        <AoFooterTable moda={differenceModa} nbm={differenceNBM} />
      </Table>
    </FormWrapper>
  );
}
