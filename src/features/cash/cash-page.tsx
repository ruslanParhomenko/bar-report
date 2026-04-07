"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { cashFormSchema, defaultCashForm } from "./schema";
import type { CashForm } from "./schema";
import { CashData, saveCashForm } from "@/app/actions/cash/cash-action";
import { toast } from "sonner";
import { sendNotificationEmail } from "@/app/actions/mail/email-action";
import { useAbility } from "@/providers/ability-provider";
import { CashFooterTable } from "./cash-footer-table";
import { useEffect, useState } from "react";
import { getMonthDays, MONTHS } from "@/utils/get-month-days";
import { Table } from "@/components/ui/table";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { AOContextValue } from "@/app/actions/a-o/ao-action";
import { zodResolver } from "@hookform/resolvers/zod";
import CashInfo from "./cash-info";
import { RowRender } from "@/components/table/row-render";
import { rowCashBar, rowsCashCasino } from "./constants";
import FormInput from "@/components/wrapper/form";
import { ValueParams } from "@/types/params";

export default function CashPage({
  dataAo,
  dataCash,
  valueParams,
}: {
  dataAo: AOContextValue | null;
  dataCash: CashData | null;
  valueParams: ValueParams;
}) {
  const { month, year } = valueParams;
  // const [tab] = useHashParam("tab");

  const monthDays = getMonthDays({ month, year });

  const { isAdmin, isCash, isBar } = useAbility();
  const isDisabled = !isAdmin && !isCash;

  const [showSendButton, setShowSendButton] = useState(false);

  const form = useForm<CashForm>({
    resolver: zodResolver(cashFormSchema),
    defaultValues: defaultCashForm,
  });

  const onSubmit: SubmitHandler<CashForm> = async (data) => {
    try {
      await saveCashForm(data, year, month);
      toast.success("Форма сохранена успешно!");
      // if (isAdmin) {
      //   await sendNotificationEmail({
      //     text: `${(data?.rowCashData?.tipsByDay as string[])?.join(",")}
      //       ${(data?.rowCashData?.cashBarByDay as string[])?.join(",")}
      //       ${(data?.rowCashData?.visaBarByDay as string[])?.join(",")}
      //       ${(data?.rowCashData?.banquetBarByDay as string[])?.join(",")}
      //      }
      //    `,
      //   });
      // }
    } catch (error) {
      toast.error("Ошибка при сохранении формы!");
    }
  };

  const initialRowData = {
    ...Object.fromEntries(
      rowsCashCasino.map((row) => [row.key, Array(monthDays.length).fill("")]),
    ),
    ...Object.fromEntries(
      rowCashBar.map((row) => [row.key, Array(monthDays.length).fill("")]),
    ),
  };

  useEffect(() => {
    if (dataCash) {
      form.reset(dataCash.form_data as CashForm);
    } else {
      form.reset({
        rowCashData: initialRowData,
        start_241: "",
        ao_532: "",
        z_531: "",
      });
    }
    if (dataAo) {
      const sumArray = (arr: string[] = []) =>
        arr.reduce((acc, num) => acc + Number(num || 0), 0);
      const totalTTNModa = sumArray(dataAo.rowAOData.ttnModaByDay as string[]);
      const totalTTNBar = sumArray(dataAo.rowAOData.ttnBarByDay as string[]);
      form.setValue("ao_532", (totalTTNModa + totalTTNBar).toString());
    }
  }, [dataCash, dataAo, month, year]);

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

  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      withButtons={(showSendButton && !isBar) || isAdmin}
      disabled={isDisabled}
      onError={(error) => console.log(error)}
    >
      <Table className="md:mt-4">
        <DayByMonthTable
          month={month}
          monthDays={monthDays}
          infoCell={true}
          navCell={true}
        />
        <RowRender<CashForm, "rowCashData">
          nameField="rowCashData"
          nameLabel="CASH"
          arrayRows={rowsCashCasino}
          form={form}
          monthDays={monthDays}
          withTotalFooter={false}
        />

        <RowRender<CashForm, "rowCashData">
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
