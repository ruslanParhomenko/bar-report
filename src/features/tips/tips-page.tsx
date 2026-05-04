"use client";
import { createTips, GetTipsData } from "@/app/actions/tips/tips-action";
import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { useEmployees } from "@/providers/employees-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import BidForm from "./bid-form";
import { defaultTipsForm, TipsForm, tipsSchema } from "./schema";
import { TipsTableBody } from "./tips-body";
import { TipsTableFooter } from "./tips-footer";
import TipsHeaderTable from "./tips-header";

const SELECTED_ROLE = ["waiters", "barmen"] as const;

export default function TipsPage({
  dataTips,
}: {
  dataTips: GetTipsData | null;
}) {
  const { isAdmin } = useAbility();

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  const { isEdit, setIsEdit } = useEdit();
  const { monthDays, month, year } = useMonthDays();

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

  // fields
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

    setIsEdit(false);
  };

  const addNewRow = () => {
    append({
      id: (fields.length + 1).toString(),
      employee: "",
      role: "",
      tipsByDay: Array(monthDays.length).fill(""),
    });
  };

  const removeRow = (index: number) => {
    if (!isAdmin) return;
    remove(index);
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
    const mewRowsCashTips = Array(monthDays.length).fill("");

    form.setValue("rowEmployeesTips", newRows);
    form.setValue("rowCashTips", mewRowsCashTips);
  }, [dataTips, month, year, form, monthDays.length]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <BidForm disabled={!isAdmin} />

      <Table className="table-fixed">
        <TipsHeaderTable
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          addNewRow={addNewRow}
          isEdit={isEdit}
        />

        <TipsTableBody
          data={fields}
          remove={removeRow}
          selectedEmployees={employees}
          selectedDay={selectedDay}
          monthDays={monthDays}
          isEdit={isEdit}
        />

        <TipsTableFooter isEdit={isEdit} />
      </Table>
    </FormWrapper>
  );
}
