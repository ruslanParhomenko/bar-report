"use client";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { Table } from "@/components/ui/table";
import { getMonthDays } from "@/utils/get-month-days";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import TTNBodyTable from "./ttn-body-table";
import { SuppliersFormType, suppliersSchema } from "./schema";
import { useAbility } from "@/providers/ability-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTTN,
  TTNGetDataType,
  updateTTN,
} from "@/app/actions/ttn/ttn-actions";
import { toast } from "sonner";
import { useEffect } from "react";
import TTNFooterTable from "./ttn-footer-table";
import FormInput from "@/components/wrapper/form";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";

export default function TTNForm({
  dataTtn,
  dataTtnPrev,
  agentTTN,
  month,
  year,
}: {
  dataTtn: TTNGetDataType | null;
  dataTtnPrev: TTNGetDataType | null;
  agentTTN: CreateDataTTN["agent"];
  month: string;
  year: string;
}) {
  const { monthDays } = getMonthDays({ month, year });

  const { isAdmin } = useAbility();

  const form = useForm<SuppliersFormType>({
    resolver: zodResolver(suppliersSchema),
    defaultValues: {
      rowSuppliers: {},
    },
  });

  const onError = (_: FieldErrors<SuppliersFormType>) => {
    toast.error(
      "Ошибка: проверьте числовые поля (допустимы только цифры и точка)",
    );
  };

  const onSubmit: SubmitHandler<SuppliersFormType> = async (data) => {
    const formatData = { ...data, month, year, unique_key: `${year}-${month}` };
    if (dataTtn?.id) {
      await updateTTN(dataTtn.id, formatData);
      toast.success("TTN успешно обновлён!");

      return;
    } else {
      await createTTN(formatData);
      toast.success("TTN успешно создан!");

      return;
    }
  };

  useEffect(() => {
    if (dataTtn || !agentTTN?.length) return;

    const rows = Object.fromEntries(
      agentTTN.map((s) => [
        s,
        {
          start: "",
          final: "",
          minus: Array(monthDays.length).fill(""),
          plus: Array(monthDays.length).fill(""),
        },
      ]),
    );

    form.setValue("rowSuppliers", rows);
  }, [dataTtn, form, agentTTN, monthDays]);
  useEffect(() => {
    if (!dataTtn) return;

    form.reset(dataTtn);
  }, [dataTtn, form]);

  useEffect(() => {
    if (!dataTtnPrev || !agentTTN?.length) return;
    agentTTN.forEach((agent) => {
      const value = dataTtnPrev.rowSuppliers?.[agent]?.final ?? "";

      form.setValue(`rowSuppliers.${agent}.start`, value);
    });
  }, [dataTtnPrev, month, year, form, agentTTN]);
  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      onError={onError}
      withButtons={isAdmin}
    >
      <Table>
        <DayByMonthTable month={month} monthDays={monthDays} infoCell />
        <TTNBodyTable arrayRows={[...agentTTN]} monthDays={monthDays} />
        <TTNFooterTable arrayRows={[...agentTTN]} monthDays={monthDays} />
      </Table>
    </FormInput>
  );
}
