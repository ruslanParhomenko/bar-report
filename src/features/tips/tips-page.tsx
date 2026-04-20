"use client";
import { Table } from "@/components/ui/table";
import { TipsTableBody } from "./tips-body-table";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { defaultTipsForm, TipsForm, tipsSchema } from "./schema";
import { createTips, GetTipsData } from "@/app/actions/tips/tips-action";
import { toast } from "sonner";
import { getMonthDays, MONTHS } from "@/utils/get-month-days";
import { TipsTableFooter } from "./tips-footer-table";
import { useEffect, useState } from "react";
import { useAbility } from "@/providers/ability-provider";
import BidForm from "./bid-form";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/wrapper/form";
import { useEmployees } from "@/providers/employees-provider";
import TipsCashBody from "./tips-cash-body";

const SELECTED_ROLE = ["waiters", "barmen"] as const;

export default function TipsPage({
  dataTips,
  month,
  year,
}: {
  dataTips: GetTipsData | null;
  month: string;
  year: string;
}) {
  const { isAdmin } = useAbility();
  const [showSendButton, setShowSendButton] = useState(false);

  const { monthDays } = getMonthDays({ month, year });
  const employees = useEmployees()
    .filter((e) => e.status === "active")
    .filter((e) =>
      SELECTED_ROLE.includes(e.role as (typeof SELECTED_ROLE)[number]),
    );

  // form
  const form = useForm<TipsForm>({
    resolver: zodResolver(tipsSchema),
    defaultValues: defaultTipsForm,
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { fields, remove, append } = useFieldArray<TipsForm>({
    control: form.control,
    name: "rowEmployeesTips",
  });

  const onSubmit: SubmitHandler<TipsForm> = async (data) => {
    const formattedData = {
      tipsData: data,
      year,
      month,
    };
    try {
      await createTips(formattedData);

      toast.success("Форма сохранена успешно!");
    } catch (error) {
      toast.error("Произошла ошибка при сохранении формы");
    }
  };

  useEffect(() => {
    if (dataTips) {
      form.reset(dataTips.tipsData);

      return;
    }

    const newRows = employees.map((employee, index) => ({
      id: (index + 1).toString(),
      employee: employee.name ?? "",
      role: employee.role ?? "",
      tipsByDay: Array(monthDays.length).fill(""),
    }));

    form.setValue("rowEmployeesTips", newRows);
  }, [dataTips, month, year, form, monthDays.length]);

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
      withButtons={showSendButton || isAdmin || fields.length > 0}
      disabled={!isAdmin}
    >
      <BidForm disabled={!isAdmin} />
      {fields.length > 0 && (
        <Table>
          <DayByMonthTable
            month={month}
            monthDays={monthDays}
            navCell={true}
            infoCell={true}
          />
          <TipsTableBody
            data={fields}
            monthDays={monthDays}
            form={form}
            remove={remove}
            append={append}
            selectedEmployees={employees}
          />
          <TipsCashBody monthDays={monthDays} />

          <TipsTableFooter monthDays={monthDays} form={form} />
        </Table>
      )}
    </FormInput>
  );
}
