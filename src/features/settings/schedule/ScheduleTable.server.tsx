"use client";

import { useMemo, Suspense } from "react";
import { Table } from "@/components/ui/table";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import SheduleSelectButtons from "./SheduleSelectButtons";
import SheduleHeader from "./SheduleHeader.server";
import { getMonthDays } from "@/utils/getMonthDays";
import { SkeletonTable } from "./SkeletonTable";
import SheduleBody from "./SheduleBodyClient.client";

export function ScheduleTable() {
  const form = useForm({
    defaultValues: {
      year: new Date().getFullYear().toString(),
      month: "",
      role: "",
      rowShifts: [
        {
          id: Date.now().toString(),
          number: 1,
          dayHours: "",
          nightHours: "",
          totalHours: "",
          employee: "",
          shifts: [] as string[],
        },
      ],
    },
  });

  const rowShiftsArray = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  const month = form.watch("month");
  const year = form.watch("year");
  const role = form.watch("role");

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  const storageKey = useMemo(() => {
    if (!month || !role || !year) return null;
    return `schedule_${year}_${month}_${role}`;
  }, [year, month, role]);

  const addNewRow = () => {
    const newRow = {
      id: Date.now().toString(),
      number: rowShiftsArray.fields.length + 1,
      dayHours: "",
      nightHours: "",
      totalHours: "",
      employee: "",
      shifts: Array(monthDays.length).fill(""),
    };
    rowShiftsArray.append(newRow);
  };

  const resetForm = () => {
    form.reset({
      year: new Date().getFullYear().toString(),
      month: "",
      role: "",
      rowShifts: [],
    });
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="flex flex-col">
        <SheduleSelectButtons
          form={form}
          addNewRow={addNewRow}
          resetForm={resetForm}
        />

        <Table className="table-fixed w-[99%]">
          <SheduleHeader monthDays={monthDays} />

          <Suspense fallback={<SkeletonTable days={monthDays.length} />}>
            <SheduleBody monthDays={monthDays} />
          </Suspense>
        </Table>
      </form>
    </Form>
  );
}
