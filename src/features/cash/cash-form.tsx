"use client";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { SubmitHandler, useForm } from "react-hook-form";
import { CashFormTypeInput, cashSchema, defaultCashForm } from "./schema";
import { CashData, saveCashForm } from "@/app/actions/cash/cashAction";
import { toast } from "sonner";
import { sendNotificationEmail } from "@/app/actions/mail/sendNotificationEmail";
import { useAbility } from "@/providers/AbilityProvider";
import { CashFooterTable } from "./cash-footer-table";
import { useEffect, useState } from "react";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { Table } from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { AOContextValue } from "@/app/actions/a-o/ao-action";
import { zodResolver } from "@hookform/resolvers/zod";
import CashInfo from "./cash-info";
import { RowRender } from "@/components/table/row-render";
import { rowCashBar, rowsCashCasino } from "./constants";

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
      await saveCashForm(data);
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
    if (dataCash) return;

    const makeArray = () => Array(monthDays.length).fill("");

    const newRowCashData = {
      ...Object.fromEntries(rowsCashCasino.map((row) => [row, makeArray()])),
      ...Object.fromEntries(rowCashBar.map((row) => [row, makeArray()])),
    };

    form.setValue("rowCashData", newRowCashData);
    form.setValue("start_241", "");
    form.setValue("ao_532", "");
    form.setValue("z_531", "");
  }, [dataCash]);

  useEffect(() => {
    if (!dataCash) return;

    form.reset({
      ...dataCash.form_data,
    } as CashFormTypeInput);
  }, [dataCash]);

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
    <FormWrapper
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
    </FormWrapper>
  );
}
