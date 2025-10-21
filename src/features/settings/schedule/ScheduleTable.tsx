"use client";
import { Suspense } from "react";
import { Table } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { SkeletonTable } from "./SkeletonTable";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import ScheduleSelectButtons from "./ScheduleSelectButtons";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleBody from "./ScheduleBody";

export function ScheduleTable() {
  const form = useForm<ScheduleType>({
    resolver: yupResolver(scheduleSchema),
    defaultValues: defaultSchedule,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
        })}
        className="flex flex-col"
      >
        <ScheduleSelectButtons />

        <Table className="table-fixed w-full">
          <ScheduleHeader />

          <Suspense fallback={<SkeletonTable />}>
            <ScheduleBody />
          </Suspense>
        </Table>
      </form>
    </Form>
  );
}
