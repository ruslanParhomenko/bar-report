import {
  getScheduleById,
  SchedulesContextValue,
} from "@/app/actions/schedule/scheduleAction";
import { ScheduleCreatePage } from "@/features/schedule/create/ScheduleCreatePage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; patch: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id, patch } = await params;
  const { month, year } = await searchParams;
  const schedule = (await getScheduleById(id)) as SchedulesContextValue;
  return (
    <ScheduleCreatePage
      schedule={schedule as SchedulesContextValue}
      month={month as string}
      year={year as string}
      patch={patch}
    />
  );
}
