"use client";
import { Table } from "@/components/ui/table";
import { TipsTableBody } from "./tips-body-table";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import {
  Resolver,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { defaultTipsForm, TipsFormType, tipsSchema } from "./schema";
import { saveTipsForm, TipsData } from "@/app/actions/tips/tipsAction";
import { toast } from "sonner";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { TipsTableFooter } from "./tips-footer-table";
import { useEffect, useState } from "react";
import { CashData } from "@/app/actions/cash/cashAction";
import { useAbility } from "@/providers/AbilityProvider";
import BidForm from "./bid-form";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeData } from "@/app/actions/employees/employeeAction";

export default function TipsForm({
  dataTips,
  dataCash,
  month,
  year,
  employees,
}: {
  dataTips: TipsData | null;
  dataCash: CashData | null;
  month: string;
  year: string;
  employees: EmployeeData[];
}) {
  const { isAdmin } = useAbility();
  const [showSendButton, setShowSendButton] = useState(false);

  const monthDays = getMonthDays({ month, year });

  // form
  const form = useForm<TipsFormType>({
    resolver: zodResolver(tipsSchema) as Resolver<TipsFormType>,
    defaultValues: defaultTipsForm,
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { fields, remove, append } = useFieldArray<TipsFormType>({
    control: form.control,
    name: "rowEmployeesTips",
  });

  const onSubmit: SubmitHandler<TipsFormType> = (data) => {
    try {
      saveTipsForm(data);

      toast.success("Форма сохранена успешно!");
    } catch (error) {
      toast.error("Произошла ошибка при сохранении формы");
    }
  };

  useEffect(() => {
    if (dataTips) {
      form.reset({
        ...dataTips.form_data,
      } as TipsFormType);

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
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      withButtons={showSendButton || isAdmin || fields.length > 0}
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
          <TipsTableFooter
            monthDays={monthDays}
            form={form}
            cashTips={dataCash?.form_data?.rowCashData?.tipsByDay as string[]}
          />
        </Table>
      )}
    </FormWrapper>
  );
}
