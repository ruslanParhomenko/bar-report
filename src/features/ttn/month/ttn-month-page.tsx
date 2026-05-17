"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { createTTN, GetTTNData } from "@/app/actions/ttn/ttn-actions";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { suppliersSchema, TTNForm } from "../schema";

import TtnBodyTable from "./ttn-body";
import TTNFooterTable from "./ttn-footer";
import TtnHeaderTable from "./ttn-header";

export default function TtnMonthPage({
  dataTtn,
  dataTtnPrev,
  agentTTN,
}: {
  dataTtn: GetTTNData | null;
  dataTtnPrev: GetTTNData | null;
  agentTTN: CreateDataTTN["agent"];
}) {
  const { monthDays, month, year } = useMonthDays();

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();
  const [itemSearch, setItemSearch] = useState<string>("");
  const normalizedSearch = itemSearch.trim().toLowerCase();

  // form
  const form = useForm<TTNForm>({
    resolver: zodResolver(suppliersSchema),
    defaultValues: {
      rowSuppliers: {},
    },
  });

  // submit
  const onSubmit: SubmitHandler<TTNForm> = async (data) => {
    const formatData = {
      ttnData: data,
      month,
      year,
    };
    try {
      await createTTN(formatData);
      toast.success("TTN успешно обновлён!");
    } catch (error) {
      toast.error("Ошибка при создании TTN!");
    }

    setIsEdit(false);
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

    form.reset(dataTtn.ttnData);
  }, [dataTtn, form]);

  useEffect(() => {
    if (!dataTtnPrev || !agentTTN?.length) return;
    agentTTN.forEach((agent) => {
      const value = dataTtnPrev.ttnData.rowSuppliers?.[agent]?.final ?? "";

      form.setValue(`rowSuppliers.${agent}.start`, value);
    });
  }, [dataTtnPrev, month, year, form, agentTTN]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className="max-w-[90dvw]">
      <table>
        <TtnHeaderTable
          setItemSearch={setItemSearch}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <TtnBodyTable
          arrayRows={[...agentTTN]}
          normalizedSearch={normalizedSearch}
          disabled={!isEdit}
        />
        <TTNFooterTable arrayRows={[...agentTTN]} monthDays={monthDays} />
      </table>
    </FormWrapper>
  );
}
