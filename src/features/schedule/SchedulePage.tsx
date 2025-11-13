"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Table } from "@/components/ui/table";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import {
  SchedulesContextValue,
  useSchedules,
} from "@/providers/ScheduleProvider";
import { useAbility } from "@/providers/AbilityProvider";
import { ROLE_URL } from "./create/constants";
import { usePrint } from "@/hooks/useToPrint";
import { useTelegramScreenshot } from "@/hooks/useTelegramScreenshot";
import { ScheduleActionForm } from "./ScheduleActionForm";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import ScheduleTableHeader from "./ScheduleTableHeader";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./create/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "next/navigation";
import { ScheduleTableBody } from "./ScheduleTableBody";

export function SchedulePage() {
  const { patch } = useParams();
  const { isAdmin, isMngr } = useAbility();
  const isDisabled = !isAdmin && !isMngr;

  const schedules = useSchedules();

  const currentYear = new Date().getFullYear().toString();
  const currentMonth = MONTHS[new Date().getMonth()];

  // set form
  const form = useForm<ScheduleType>({
    defaultValues: {
      ...defaultSchedule,
      year: currentYear,
      month: currentMonth,
    },
    resolver: yupResolver(scheduleSchema) as any,
  });

  // state schedule
  const [schedule, setSchedule] = useState<SchedulesContextValue | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  const month = useWatch({ control: form.control, name: "month" });
  const year = useWatch({ control: form.control, name: "year" });

  // unique key
  const uniqueKey = useMemo(() => {
    const role = ROLE_URL[patch as keyof typeof ROLE_URL];
    return `${year}-${month}-${role}`;
  }, [month, year, patch]);

  useEffect(() => {
    const found = schedules.find((s) => s.uniqueKey === uniqueKey);
    setSchedule(found || null);
  }, [uniqueKey]);

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month: month, year: year });
  }, [month, year]);

  // const shiftCounts = getShiftCounts(schedule);

  const todayDay = new Date().getDate();
  const todayIndex = monthDays.findIndex((day) => day.day === todayDay);
  useEffect(() => {
    if (todayIndex !== -1) {
      setSelectedColumn(todayIndex);
    }
  }, [todayIndex]);

  const { componentRef, handlePrint } = usePrint({ title: "schedule" });
  const { sendScreenshot, isSending } = useTelegramScreenshot({
    ref: componentRef as React.RefObject<HTMLElement>,
    tagName: patch as string,
  });

  return (
    <FormWrapper form={form}>
      <ScheduleActionForm
        isView={!!schedule}
        handlePrint={handlePrint}
        sendScreenshot={sendScreenshot}
        isSending={isSending}
        isCreate={!schedule}
        id={schedule?.id}
        month={month}
        year={year}
      />
      <div ref={componentRef}>
        {schedule && (
          <Table className="md:table-fixed">
            <ScheduleTableHeader
              monthDays={monthDays}
              setSelectedColumn={setSelectedColumn}
              month={schedule?.month || month}
            />

            <ScheduleTableBody
              schedule={schedule || ({} as any)}
              selectedColumn={selectedColumn || 0}
              isView={schedule ? true : false}
            />
            <ScheduleTableHeader
              monthDays={monthDays}
              setSelectedColumn={setSelectedColumn}
              month={schedule?.month}
              isTop={false}
            />
          </Table>
        )}
      </div>
    </FormWrapper>
  );
}
