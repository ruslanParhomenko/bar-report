"use client";
import { Suspense } from "react";
import { Table } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import SheduleSelectButtons from "./SheduleSelectButtons";
import SheduleHeader from "./SheduleHeader";
import { SkeletonTable } from "./SkeletonTable";
import SheduleBody from "./SheduleBody";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";

export function ScheduleTable() {
  const form = useForm<ScheduleType>({
    resolver: yupResolver(scheduleSchema),
    defaultValues: defaultSchedule,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="flex flex-col">
        <SheduleSelectButtons />

        <Table className="table-fixed w-[98%]">
          <SheduleHeader />

          <Suspense fallback={<SkeletonTable />}>
            <SheduleBody />
          </Suspense>
        </Table>
      </form>
    </Form>
  );
}
