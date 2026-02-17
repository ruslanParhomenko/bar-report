"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { CashFormTypeInput, cashSchema, defaultCashForm } from "./schema";
import { CashData, saveCashForm } from "@/app/actions/cash/cash-action";
import { toast } from "sonner";
import { sendNotificationEmail } from "@/app/actions/mail/email-action";
import { useAbility } from "@/providers/ability-provider";
import { CashFooterTable } from "./cash-footer-table";
import { useEffect, useState } from "react";
import { getMonthDays, MONTHS } from "@/utils/get-month-days";
import { Table } from "@/components/ui/table";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { AOContextValue } from "@/app/actions/a-o/ao-action";
import { zodResolver } from "@hookform/resolvers/zod";
import CashInfo from "./cash-info";
import { RowRender } from "@/components/table/row-render";
import { rowCashBar, rowsCashCasino } from "./constants";
import FormInput from "@/components/wrapper/form";

export default function CashForm({
  dataAo,
  dataCash,
  month,
  year,
}: {
  dataAo: AOContextValue | null;
  dataCash: CashData | null;
  month: string;
  year: string;
}) {
  const router = useRouter();

  const monthDays = getMonthDays({ month, year });

  const { isAdmin, isCash, isBar } = useAbility();
  const isDisabled = !isAdmin && !isCash;

  const [showSendButton, setShowSendButton] = useState(false);

  const form = useForm<CashFormTypeInput>({
    resolver: zodResolver(cashSchema),
    defaultValues: cashSchema.parse(dataCash ?? defaultCashForm),
  });

  const onSubmit: SubmitHandler<CashFormTypeInput> = async (data) => {
    try {
      await saveCashForm(data, year, month);
      toast.success("Форма сохранена успешно!");
      if (isCash) {
        await sendNotificationEmail({
          text: `${(data?.rowCashData?.tipsByDay as string[])?.join(",")}
            ${(data?.rowCashData?.chipsByDay as string[])?.join(",")}
            ${(data?.rowCashData?.visaCasinoByDay as string[])?.join(",")}
            ${(data?.rowCashData?.cashBarByDay as string[])?.join(",")}
            ${(data?.rowCashData?.visaBarByDay as string[])?.join(",")}
            ${(data?.rowCashData?.banquetBarByDay as string[])?.join(",")}
           }
         `,
        });
      }
    } catch (error) {
      toast.error("Ошибка при сохранении формы!");
    }
  };

  useEffect(() => {
    const makeArray = () => Array(monthDays.length).fill("");

    if (!dataCash) {
      const newRowCashData = {
        ...Object.fromEntries(
          rowsCashCasino.map((row) => [row.key, makeArray()]),
        ),
        ...Object.fromEntries(rowCashBar.map((row) => [row.key, makeArray()])),
      };

      form.reset({
        ...defaultCashForm,
        rowCashData: newRowCashData,
        start_241: "",
        ao_532: "",
        z_531: "",
      });
      return;
    }

    form.reset(dataCash.form_data as CashFormTypeInput);
  }, [dataCash, month, year]);

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = MONTHS[currentDate.getMonth()];
    const prevMonth = MONTHS[currentDate.getMonth() - 1];

    const show =
      year === currentYear.toString() &&
      (month === currentMonth || month === prevMonth);

    setShowSendButton(show);
  }, [month, year]);

  useEffect(() => {
    const uniqueId = dataCash?.unique_id;
    const channel = supabase
      .channel("public:cash")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cash" },
        (payload: any) => {
          if (payload.new?.unique_id === uniqueId) {
            router.refresh();
            toast.info("Данные обновились в реальном времени!");
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dataCash, form]);

  useEffect(() => {
    if (!dataAo) return;

    const totalTTNModa = (dataAo?.rowAOData?.ttnModaByDay as string[])
      ?.reduce((acc: number, num: string) => acc + Number(num || 0), 0)
      .toFixed(2);
    const totalTTNBar = (dataAo?.rowAOData?.ttnBarByDay as string[])
      ?.reduce((acc: number, num: string) => acc + Number(num || 0), 0)
      .toFixed(2);
    form.setValue(
      "ao_532",
      (Number(totalTTNModa) + Number(totalTTNBar)).toString(),
    );
  }, [dataAo]);

  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      withButtons={showSendButton || isAdmin || !isBar}
    >
      <Table className="md:mt-4">
        <DayByMonthTable
          month={month}
          monthDays={monthDays}
          infoCell={true}
          navCell={true}
        />
        <RowRender<CashFormTypeInput, "rowCashData">
          nameField="rowCashData"
          nameLabel="CASH"
          arrayRows={rowsCashCasino}
          form={form}
          monthDays={monthDays}
          withTotalFooter={false}
        />

        <RowRender<CashFormTypeInput, "rowCashData">
          nameField="rowCashData"
          nameLabel="BAR"
          arrayRows={rowCashBar}
          form={form}
          monthDays={monthDays}
          withTotalFooter={false}
        />
        <CashFooterTable monthDays={monthDays} form={form} />
        <CashInfo monthDays={monthDays} form={form} isDisabled={isDisabled} />
      </Table>
    </FormInput>
  );
}
