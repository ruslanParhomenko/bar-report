"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTtnNbm, GetTtnNbmData } from "@/app/actions/ttn/ttn-nbm-action";
import { suppliersSchemaNBM, TTNFormNBM } from "./schema";
import TtnNbmBodyTable from "./ttn-nbm-body";
import TtnNbmHeaderTable from "./ttn-nbm-header";

export default function TtnNbmMonthPage({
  dataTtnNBM,
  agentTtnNbm,
}: {
  dataTtnNBM: GetTtnNbmData[] | null;
  agentTtnNbm: CreateDataTTN["agentNbm"];
}) {
  const { monthDays, month, year } = useMonthDays();

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();

  const dataTtnNbmByMont = dataTtnNBM?.find((ttn) => ttn.id === month);

  // form
  const form = useForm<TTNFormNBM>({
    resolver: zodResolver(suppliersSchemaNBM),
    defaultValues: {
      rowSuppliers: {},
    },
  });

  // submit
  const onSubmit: SubmitHandler<TTNFormNBM> = async (data) => {
    const formatData = {
      ttnData: data,
      month,
      year,
    };
    try {
      await createTtnNbm(formatData);
      toast.success("TTN успешно обновлён!");
    } catch (error) {
      toast.error("Ошибка при создании TTN!");
    }

    setIsEdit(false);
  };

  useEffect(() => {
    if (dataTtnNBM || !agentTtnNbm?.length) return;

    const rows = Object.fromEntries(
      agentTtnNbm.map((s) => [
        s,
        {
          minus: Array(monthDays.length).fill(""),
        },
      ]),
    );

    form.setValue("rowSuppliers", rows);
  }, [dataTtnNBM, form, agentTtnNbm, monthDays]);
  useEffect(() => {
    if (!dataTtnNbmByMont) return;

    form.reset(dataTtnNbmByMont?.ttnData);
  }, [dataTtnNbmByMont, form]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className="max-w-[90dvw]">
      <table>
        <TtnNbmHeaderTable
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <TtnNbmBodyTable
          arrayRows={[...agentTtnNbm]}
          disabled={!isEdit}
          setSelectedDay={setSelectedDay}
        />
      </table>
    </FormWrapper>
  );
}
