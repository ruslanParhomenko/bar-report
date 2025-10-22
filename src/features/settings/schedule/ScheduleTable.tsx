"use client";
import { Suspense, useMemo } from "react";
import { Table } from "@/components/ui/table";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { SkeletonTable } from "./SkeletonTable";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import ScheduleSelectButtons from "./ScheduleSelectButtons";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleBody from "./ScheduleBody";
import ScheduleFooter from "./ScheduleFooter";
import { SHIFT_OPTIONS } from "../constants";
import { createSchedule } from "@/app/actions/schedule/scheduleAction";
import { getMonthDays } from "@/utils/getMonthDays";

export function ScheduleTable() {
  const form = useForm<ScheduleType>({
    resolver: yupResolver(scheduleSchema),
    defaultValues: defaultSchedule,
  });
  const month = form.watch("month");
  const year = form.watch("year");

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  const onSubmit: SubmitHandler<ScheduleType> = async (data) => {
    const formatData = {
      ...data,
      uniqueKey: `${data.year}-${data.month}-${data.role}`,
    };
    await createSchedule(formatData);
    console.log(formatData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <ScheduleSelectButtons />

        <Table className="table-fixed w-full">
          <ScheduleHeader monthDays={monthDays} />

          <Suspense fallback={<SkeletonTable />}>
            <ScheduleBody />
          </Suspense>
          <ScheduleFooter data={SHIFT_OPTIONS || []} />
        </Table>
      </form>
    </Form>
  );
}
