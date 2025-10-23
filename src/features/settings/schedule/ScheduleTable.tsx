"use client";
import { useMemo } from "react";
import { Table } from "@/components/ui/table";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { defaultSchedule, scheduleSchema, ScheduleType } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import ScheduleSelectButtons from "./ScheduleSelectButtons";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleBody from "./ScheduleBody";
import ScheduleFooter from "./ScheduleFooter";
import {
  createSchedule,
  ScheduleData,
  updateSchedule,
} from "@/app/actions/schedule/scheduleAction";
import { getMonthDays } from "@/utils/getMonthDays";
import { useSchedules } from "@/providers/ScheduleProvider";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { SHIFT_OPTIONS } from "./constants";

export function ScheduleTable() {
  const { id } = useParams();
  const router = useRouter();
  const schedules = useSchedules();
  const found = schedules.find((s) => s.id === id);

  const form = useForm<ScheduleType>({
    resolver: yupResolver(scheduleSchema) as any,
    defaultValues: found || defaultSchedule,
  });

  const month = form.watch("month");
  const year = form.watch("year");

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  const onSubmit: SubmitHandler<ScheduleType> = async (data) => {
    const formatData: ScheduleData = {
      ...data,
      uniqueKey: `${data.year}-${data.month}-${data.role}`,
    };

    const existing = schedules?.find(
      (s) => s.uniqueKey === formatData.uniqueKey
    );

    if (id) {
      await updateSchedule(id as string, formatData);
      toast.success("✏️ График успешно обновлён!");
      router.back();
      return;
    }

    if (!id && !existing) {
      await createSchedule(formatData);
      toast.success("✅ График успешно создан!");
      form.reset(defaultSchedule);
      return;
    }

    toast.error(
      "⚠️ График с такими параметрами уже существует или некорректные данные!"
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="flex flex-col"
      >
        <ScheduleSelectButtons />

        <Table className="table-fixed w-full">
          <ScheduleHeader monthDays={monthDays} />

          <ScheduleBody key={form.watch("rowShifts").length} />

          <ScheduleFooter data={SHIFT_OPTIONS || []} />
        </Table>
      </form>
    </Form>
  );
}
