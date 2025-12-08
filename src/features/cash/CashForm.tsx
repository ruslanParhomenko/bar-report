"use client";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { SubmitHandler, useForm } from "react-hook-form";
import { CashFormType, cashSchema, defaultCashForm } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { CashData, saveCashForm } from "@/app/actions/cash/cashAction";
import { toast } from "sonner";
import { sendNotificationEmail } from "@/app/actions/mail/sendNotificationEmail";
import { useAbility } from "@/providers/AbilityProvider";
import { CashBodyTable } from "./CashBodyTable";
import { CashFooterTable } from "./CashFooterTable";
import { useEffect, useState } from "react";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { Table } from "@/components/ui/table";
import { CashHeaderTable } from "./CashHeaderTable";
import { SendResetButton } from "@/components/buttons/SendResetButton";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CashForm({
  dataCash,
  monthDays,
  month,
  year,
}: {
  dataCash: CashData | null;
  monthDays: ReturnType<typeof getMonthDays>;
  month: string;
  year: string;
}) {
  const router = useRouter();

  const { isAdmin, isCash } = useAbility();
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

  // supabase real-time subscription can be added here if needed
  useEffect(() => {
    const uniqueId = dataCash?.unique_id;
    const channel = supabase
      .channel("public:cash")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cash" },
        (payload: any) => {
          if (payload.new?.unique_id === uniqueId) {
            // Обновляем форму Realtime данными от другого пользователя
            // form.reset(payload.new.form_data);
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

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col h-[90vh] w-full"
    >
      <Table>
        <CashHeaderTable monthDays={monthDays} month={month} />
        <CashBodyTable
          form={form}
          monthDays={monthDays}
          isDisabled={isDisabled}
        />
        <CashFooterTable monthDays={monthDays} form={form} />
      </Table>
      {(showSendButton || isAdmin) && <SendResetButton />}
    </FormWrapper>
  );
}
