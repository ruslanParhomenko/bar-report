"use client";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { SubmitHandler, useForm } from "react-hook-form";
import { CashFormType, cashSchema, defaultCashForm } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { CashData, saveCashForm } from "@/app/actions/cash/cashAction";
import { toast } from "sonner";
import { sendNotificationEmail } from "@/app/actions/mail/sendNotificationEmail";
import { useAbility } from "@/providers/AbilityProvider";
import { CashBodyTable } from "./cash-body-table";
import { CashFooterTable } from "./cash-footer-table";
import { useEffect, useState } from "react";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { Table } from "@/components/ui/table";
import SubmitButton from "@/components/buttons/submit-button";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { AOContextValue } from "@/app/actions/a-o/ao-action";

export default function CashForm({
  dataAo,
  dataCash,
  monthDays,
  month,
  year,
}: {
  dataAo: AOContextValue | null;
  dataCash: CashData | null;
  monthDays: ReturnType<typeof getMonthDays>;
  month: string;
  year: string;
}) {
  console.log(dataAo);
  const router = useRouter();

  const { isAdmin, isCash, isBar } = useAbility();
  const isDisabled = !isAdmin && !isCash;

  const [showSendButton, setShowSendButton] = useState(false);

  const form = useForm<CashFormType>({
    resolver: yupResolver(cashSchema),
    defaultValues: defaultCashForm,
  });

  const onSubmit: SubmitHandler<CashFormType> = async (data) => {
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
      tipsByDay: makeArray(),
      chipsByDay: makeArray(),
      visaCasinoByDay: makeArray(),
      cashBarByDay: makeArray(),
      visaBarByDay: makeArray(),
      banquetBarByDay: makeArray(),
      visaCasinoBarByDay: makeArray(),
      cash: makeArray(),
      visaTerminalByDay: makeArray(),
      nbmPayByDay: makeArray(),
      bankCollectionByDay: makeArray(),
      nbmCollectionByDay: makeArray(),
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
    } as CashFormType);
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dataCash, form]);

  useEffect(() => {
    if (!dataAo) return;

    const totalTTNModa = (dataAo?.rowAOData?.ttnModaByDay as string[])?.reduce(
      (acc: number, num: string) => acc + Number(num || 0),
      0
    );
    const totalTTNBar = (dataAo?.rowAOData?.ttnBarByDay as string[])?.reduce(
      (acc: number, num: string) => acc + Number(num || 0),
      0
    );
    form.setValue("ao_532", (totalTTNModa + totalTTNBar).toString());
  }, [dataAo]);

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col h-[90vh] w-full"
    >
      <Table>
        <DayByMonthTable month={month} monthDays={monthDays} />
        <CashBodyTable
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
          isClosed={isBar}
        />
        <CashFooterTable monthDays={monthDays} form={form} />
      </Table>
      {(showSendButton || isAdmin) && !isBar && <SubmitButton />}
    </FormWrapper>
  );
}
