import {
  getScheduleById,
  SchedulesContextValue,
} from "@/app/actions/schedule/schedule-action";
import { ScheduleCreatePage } from "@/features/schedule/create/schedule-form";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; patch: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { month, year, tab } = await searchParams;
  if (!month || !year || !tab || !id) return null;
  const schedule = (await getScheduleById(id)) as SchedulesContextValue;
  return (
    <ScheduleCreatePage
      schedule={schedule as SchedulesContextValue}
      month={month as string}
      year={year as string}
      tab={tab as string}
    />
  );
}
