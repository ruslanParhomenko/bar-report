"use client";

import { Table } from "@/components/ui/table";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createAO } from "../../actions/create-ao";
import { calculateRowAOTotals } from "../../lib/utils";
import {
  ROWS_ADVANCE,
  ROWS_PURCHASE_MODA,
  ROWS_PURCHASE_NMB,
} from "../../model/constants";
import { AoForm, aoSchema } from "../../model/schema";
import { GetAoData } from "../../model/type";
import AoBodyTable from "./ao-body";
import AoFooterTable from "./ao-footer";
import AoHeaderTable from "./ao-header";
import { useMonthDays } from "@/hooks/use-month-days";

export default function AoMonthPage({
  dataAoYear,
}: {
  dataAoYear: GetAoData[] | null;
}) {
  const { monthDays, month, year } = useMonthDays();

  const dataAo = dataAoYear?.find((ao) => ao.id === month) || null;

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
      ...Object.fromEntries(ROWS_ADVANCE.map((row) => [row.key, makeArray()])),
      ...Object.fromEntries(
        ROWS_PURCHASE_MODA.map((row) => [row.key, makeArray()]),
      ),
      ...Object.fromEntries(
        ROWS_PURCHASE_NMB.map((row) => [row.key, makeArray()]),
      ),
    };
  }, [monthDays.length, ROWS_ADVANCE, ROWS_PURCHASE_MODA, ROWS_PURCHASE_NMB]);

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

  const nori = (n(totals.purchaseModaByDay) + n(totals.ttnModaByDay)).toFixed(
    2,
  );
  const bar = (
    n(totals.purchaseBarByDay) +
    n(totals.ttnBarByDay) +
    n(totals.purchaseCookByDay)
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
          data={ROWS_ADVANCE}
          selectedDay={selectedDay}
          isEdit={isEdit}
          fieldName="rowAOData"
        />
        <AoBodyTable
          data={ROWS_PURCHASE_MODA}
          selectedDay={selectedDay}
          isEdit={isEdit}
          fieldName="rowAOData"
        />
        <AoBodyTable
          data={ROWS_PURCHASE_NMB}
          selectedDay={selectedDay}
          isEdit={isEdit}
          fieldName="rowAOData"
        />
        <AoFooterTable
          moda={differenceModa}
          nbm={differenceNBM}
          nori={nori}
          bar={bar}
        />
      </Table>
    </FormWrapper>
  );
}
