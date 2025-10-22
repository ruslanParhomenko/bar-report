"use client";
import { Suspense, useMemo, useEffect } from "react";
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
import {
  createSchedule,
  ScheduleData,
  updateSchedule,
} from "@/app/actions/schedule/scheduleAction";
import { getMonthDays } from "@/utils/getMonthDays";
import { useSchedules } from "@/providers/ScheduleProvider";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { ro } from "date-fns/locale";
import { useRouter } from "@/i18n/navigation";

export function ScheduleTable() {
  const { id } = useParams();
  const router = useRouter();
  const schedules = useSchedules();

  const form = useForm<ScheduleType>({
    resolver: yupResolver(scheduleSchema) as any,
    defaultValues: defaultSchedule,
  });

  const month = form.watch("month");
  const year = form.watch("year");

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  // 🧠 ЭФФЕКТ: если в params есть id — подставляем данные из schedules
  useEffect(() => {
    if (!id || !schedules?.length) return;

    const found = schedules.find((s) => s.id === id);
    if (found) {
      form.reset(found as ScheduleType);
      toast.info(
        `✏️ Режим редактирования: ${found.role} (${found.month}/${found.year})`
      );
    } else {
      toast.error("⚠️ График с таким ID не найден");
    }
  }, [id, schedules, form]);

  const onSubmit: SubmitHandler<ScheduleType> = async (data) => {
    const formatData: ScheduleData = {
      ...data,
      uniqueKey: `${data.year}-${data.month}-${data.role}`,
    };

    const existing = schedules?.find(
      (s) => s.uniqueKey === formatData.uniqueKey
    );

    // 🧩 1. Если есть id в параметрах → только update
    if (id) {
      await updateSchedule(id as string, formatData);
      toast.success("✏️ График успешно обновлён!");
      router.back();
      return;
    }

    // 🧩 2. Если нет id и график с таким ключом ещё не существует → create
    if (!id && !existing) {
      await createSchedule(formatData);
      toast.success("✅ График успешно создан!");
      form.reset(defaultSchedule);
      return;
    }

    // 🧩 3. Все остальные случаи → ошибка
    toast.error(
      "⚠️ График с такими параметрами уже существует или некорректные данные!"
    );
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
