"use client";
import { Table } from "@/components/ui/table";
import { TipsTableBody } from "./tips-body";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { defaultTipsForm, TipsForm, tipsSchema } from "./schema";
import { createTips, GetTipsData } from "@/app/actions/tips/tips-action";
import { toast } from "sonner";
import { TipsTableFooter } from "./tips-footer";
import { useEffect, useRef, useState } from "react";
import { useAbility } from "@/providers/ability-provider";
import BidForm from "./bid-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEmployees } from "@/providers/employees-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import TipsHeaderTable from "./tips-header";
import { Form } from "@/components/ui/form";
import { useRealtimeSave } from "@/hooks/use-realtime-save";

const SELECTED_ROLE = ["waiters", "barmen"] as const;

export default function TipsPage({
  dataTips,
}: {
  dataTips: GetTipsData | null;
}) {
  const { isAdmin } = useAbility();

  const todayDay = new Date().getDate();

  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  const [isEdit, setIsEdit] = useState(false);

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

  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <BidForm disabled={!isAdmin} />

        <div ref={ref} data-screenshot-root="true">
          <Table className="table-fixed">
            <TipsHeaderTable
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              addNewRow={addNewRow}
              setIsEdit={setIsEdit}
              isEdit={isEdit}
              ref={ref}
              disabled={!isAdmin}
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
        </div>
      </form>
    </Form>
  );
}
