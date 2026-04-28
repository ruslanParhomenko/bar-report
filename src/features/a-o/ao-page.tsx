"use client";

import { Table } from "@/components/ui/table";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import {
  AOContextValue,
  createAO,
  updateAO,
} from "@/app/actions/a-o/ao-action";
import { Form } from "@/components/ui/form";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AoBodyTable from "./ao-body";
import AoFooterTable from "./ao-footer";
import AoHeaderTable from "./ao-header";
import { rowsAdvance, rowsPurchaseModa, rowsPurchaseNMB } from "./constants";
import { AOFormTypeInput, aoSchema } from "./schema";
import { calculateRowAOTotals } from "./utils";

export default function AoPage({ dataAo }: { dataAo: AOContextValue | null }) {
  const { monthDays, month, year } = useMonthDays();

  const pathname = usePathname();
  const formId = pathname.split("/").pop() || "";

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();

  // form
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
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
      </form>
    </Form>
  );
}
