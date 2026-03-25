import {
  getScheduleById,
  SchedulesContextValue,
} from "@/app/actions/schedule/schedule-action";
import { ScheduleCreatePage } from "@/features/schedule/create/schedule-form";
import { ValueParams } from "@/types/params";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id } = await params;

  const query = (await searchParams) as ValueParams;
  const { month, year, tab } = query;

  if (!month || !year || !tab || !id) return null;

  const schedule = (await getScheduleById(id)) as SchedulesContextValue;

  return <ScheduleCreatePage schedule={schedule} params={query} />;
}
