"use client";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Table } from "@/components/ui/table";
import { DataTTN } from "@/features/settings/setting/model/type";
import { createTtnNbm } from "../actions/create-nbm-ttn";
import { suppliersSchemaNBM, TTNFormNBM } from "../model/schema";
import { GetTtnNbmData } from "../model/type";
import TtnNbmBodyTable from "./ttn-nbm-body";
import TtnNbmHeaderTable from "./ttn-nbm-header";
import { useMonthDays } from "@/hooks/use-month-days";

export function TtnNbmMonthPage({
  dataTtnNBM,
  agentTtnNbm,
}: {
  dataTtnNBM: GetTtnNbmData[] | null;
  agentTtnNbm: DataTTN["agentNbm"];
}) {
  const { monthDays, month, year } = useMonthDays();
  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const { isEdit, setIsEdit } = useEdit();

  const dataTtnNbmByMont = dataTtnNBM?.find((ttn) => ttn.id === month);

  const form = useForm<TTNFormNBM>({
    resolver: zodResolver(suppliersSchemaNBM),
    defaultValues: {
      rowSuppliers: {},
    },
  });

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
    if (dataTtnNbmByMont || !agentTtnNbm?.length) return;

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
      <Table className="mt-6">
        <TtnNbmHeaderTable
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        <TtnNbmBodyTable
          arrayRows={[...agentTtnNbm]}
          disabled={!isEdit}
          setSelectedDay={setSelectedDay}
        />
      </Table>
    </FormWrapper>
  );
}
