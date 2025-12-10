"use client";
import { Table } from "@/components/ui/table";
import { TipsTableHeader } from "./TipsTableHeader";
import { TipsTableBody } from "./TipsTableBody";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import {
  Resolver,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultTipsForm, TipsFormType, tipsSchema } from "./schema";
import { saveTipsForm, TipsData } from "@/app/actions/tips/tipsAction";
import { toast } from "sonner";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { TipsTableFooter } from "./TipsTableFooter";
import { useEmployees } from "@/providers/EmployeesProvider";
import { useEffect, useMemo, useState } from "react";
import { groupRowsByRole } from "./utils";
import { CashData } from "@/app/actions/cash/cashAction";
import { useAbility } from "@/providers/AbilityProvider";
import { SendResetButton } from "@/components/buttons/SendResetButton";

const SELECTED_ROLE = ["barmen", "waiters", "dish"];

export default function TipsForm({
  dataTips,
  dataCash,
  monthDays,
  month,
  year,
}: {
  dataTips: TipsData | null;
  dataCash: CashData | null;
  monthDays: ReturnType<typeof getMonthDays>;
  month: string;
  year: string;
}) {
  const { isAdmin } = useAbility();
  const [showSendButton, setShowSendButton] = useState(false);
  const employees = useEmployees();
  // form
  const form = useForm<TipsFormType>({
    resolver: yupResolver(tipsSchema) as unknown as Resolver<TipsFormType>,
    defaultValues: defaultTipsForm,
  });
  const { fields, remove, append, move } = useFieldArray<TipsFormType>({
    control: form.control,
    name: "rowEmployeesTips",
  });

  // set employees
  const selectedEmployees = useMemo(() => {
    return employees
      .filter((emp) => SELECTED_ROLE.includes(emp.role))
      .filter((emp) => !["barmen", "waiter", "dish"].includes(emp.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees]);
  // submit
  const onSubmit: SubmitHandler<TipsFormType> = (data) => {
    const { cashTips, ...dataWithoutCash } = data;

    saveTipsForm(dataWithoutCash);

    toast.success("Форма сохранена успешно!");
  };

  // effect
  useEffect(() => {
    if (!dataTips) return;

    form.reset({
      ...dataTips?.form_data,
    } as TipsFormType);
  }, [dataTips]);

  useEffect(() => {
    if (!dataCash) return;
    form.setValue(
      "cashTips",
      dataCash?.form_data?.rowCashData?.tipsByDay as string[]
    );
  }, [dataCash]);

  useEffect(() => {
    if (dataTips) return;

    const newRows = selectedEmployees.map((employee, index) => ({
      id: (index + 1).toString(),
      employee: employee.name ?? "",
      role: employee.role ?? "",
      tips: "",
      tipsByDay: Array(monthDays.length).fill(""),
    }));

    form.setValue("rowEmployeesTips", newRows);
    form.setValue("cashTips", Array(monthDays.length).fill(""));
  }, [dataTips, month, year]);

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

  const rowsByRole = useMemo(() => groupRowsByRole(fields), [fields]);
  const dataRowsCount = Object.values(rowsByRole).flat();
  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col h-[92vh]"
    >
      <Table className="md:table-fixed">
        <TipsTableHeader monthDays={monthDays} month={month} />
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
      {(showSendButton || isAdmin) && fields.length > 0 && <SendResetButton />}
    </FormWrapper>
  );
}
