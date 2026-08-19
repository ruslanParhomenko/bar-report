"use client";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createSchedule } from "../actions/create-schedule";
import { calculateSalaryByHours, calculateShiftTotals } from "../lib/utils";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "../model/constants";
import { defaultSchedule, scheduleSchema, ScheduleType } from "../model/schema";
import { useMonthDays } from "@/hooks/use-month-days";

export function useScheduleForm(tab: string | null) {
  const { month, year } = useMonthDays();
  const { setIsEdit } = useEdit();

  const form = useForm<ScheduleType>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: defaultSchedule,
  });

  const onSubmit: SubmitHandler<ScheduleType> = async (data) => {
    const rowShiftsWithHours = data.rowShifts.map((row) => {
      if (!row.shifts) return row;
      const { totalDay, totalNight, total } = calculateShiftTotals(row.shifts);

      const totalPay = calculateSalaryByHours({
        ...row,
        dayHours: totalDay.toString(),
        nightHours: totalNight.toString(),
        totalHours: total.toString(),
      });

      return {
        ...row,
        dayHours: totalDay.toString(),
        nightHours: totalNight.toString(),
        totalHours: total.toString(),
        salary: totalPay.toFixed(0).toString(),
      };
    });
    const formatData = {
      year,
      month,
      role: tab as keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT,
      rowShifts: rowShiftsWithHours,
    };

    await createSchedule(formatData);
    toast.success("График успешно создан!");

    setIsEdit(false);
  };

  return {
    form,
    onSubmit,
  };
}
