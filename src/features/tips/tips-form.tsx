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
import { useEmployees } from "@/providers/EmployeesProvider";
import { useEffect, useMemo, useState } from "react";
import { groupRowsByRole } from "./utils";
import { CashData } from "@/app/actions/cash/cashAction";
import { useAbility } from "@/providers/AbilityProvider";
import BidForm from "./bid-form";
import { DayByMonthTable } from "@/components/table/day-by-month-table";
import { zodResolver } from "@hookform/resolvers/zod";

const SELECTED_ROLE = ["barmen", "waiters", "dish"];

export default function TipsForm({
  dataTips,
  dataCash,
  month,
  year,
}: {
  dataTips: TipsData | null;
  dataCash: CashData | null;
  month: string;
  year: string;
}) {
  const { isAdmin } = useAbility();
  const [showSendButton, setShowSendButton] = useState(false);
  const employees = useEmployees();

  const monthDays = getMonthDays({ month, year });

  // form
  const form = useForm<TipsFormType>({
    resolver: zodResolver(tipsSchema) as Resolver<TipsFormType>,
    defaultValues: defaultTipsForm,
  });
  const { fields, remove, append, move } = useFieldArray<TipsFormType>({
    control: form.control,
    name: "rowEmployeesTips",
  });

  // set employees
  const selectedEmployees = useMemo(() => {
    return employees
      .filter(
        (emp) =>
          SELECTED_ROLE.includes(emp.role) &&
          !["barmen", "waiter", "dish"].includes(emp.name)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees]);
  // submit
  const onSubmit: SubmitHandler<TipsFormType> = (data) => {
    const { cashTips, ...dataWithoutCash } = data;

    saveTipsForm(dataWithoutCash);

    toast.success("Форма сохранена успешно!");
  };

  useEffect(() => {
    if (dataTips) {
      form.reset({
        ...dataTips.form_data,
      } as TipsFormType);

      if (dataCash) {
        form.setValue(
          "cashTips",
          dataCash.form_data?.rowCashData?.tipsByDay as string[]
        );
      }
      return;
    }

    const newRows = selectedEmployees.map((employee, index) => ({
      id: (index + 1).toString(),
      employee: employee.name ?? "",
      role: employee.role ?? "",
      tips: "",
      tipsByDay: Array(monthDays.length).fill(""),
    }));

    form.setValue("rowEmployeesTips", newRows);
    form.setValue("cashTips", Array(monthDays.length).fill(""));
  }, [
    dataTips,
    dataCash,
    month,
    year,
    selectedEmployees,
    form,
    monthDays.length,
  ]);

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

  const dataRowsCount = useMemo(() => {
    const grouped = groupRowsByRole(fields);
    return Object.values(grouped).flat();
  }, [fields]);

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      withButtons={showSendButton || isAdmin || fields.length > 0}
    >
      <BidForm disabled={!isAdmin} />
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
          move={move}
          dataRowsCount={dataRowsCount}
          selectedEmployees={selectedEmployees}
        />
        <TipsTableFooter
          monthDays={monthDays}
          form={form}
          dataRowsCount={dataRowsCount.length}
        />
      </Table>
    </FormWrapper>
  );
}
