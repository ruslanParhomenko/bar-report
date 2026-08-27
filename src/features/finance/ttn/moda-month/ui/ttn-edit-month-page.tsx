"use client";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { suppliersSchema, TTNForm } from "../model/schema";

import { DataTTN } from "@/features/setting/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { createTTN } from "../actions/create-ttn-moda";
import { GetTTNData } from "../model/type";
import TtnEditBodyTable from "./ttn-edit-body";
import TTNFooterTable from "./ttn-footer";
import TtnHeaderTable from "./ttn-header";

export function TtnEditMonthPage({
  dataTtn,
  dataTtnPrev,
  agentTTN,
}: {
  dataTtn: GetTTNData | null;
  dataTtnPrev: GetTTNData | null;
  agentTTN: DataTTN["agent"];
}) {
  const { monthDays, month, year } = useMonthDays();

  console.log(dataTtn);

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();
  const [itemSearch, setItemSearch] = useState<string>("");
  const normalizedSearch = itemSearch.trim().toLowerCase();

  const form = useForm<TTNForm>({
    resolver: zodResolver(suppliersSchema),
    defaultValues: {
      rowSuppliers: {},
    },
  });

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
        <TtnEditBodyTable
          arrayRows={[...agentTTN]}
          normalizedSearch={normalizedSearch}
          disabled={!isEdit}
          setSelectedDay={setSelectedDay}
        />
        <TTNFooterTable arrayRows={[...agentTTN]} monthDays={monthDays} />
      </table>
    </FormWrapper>
  );
}
