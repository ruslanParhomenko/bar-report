import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
import SchedulePage from "@/features/schedule/schedule-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { month, year, tab } = await searchParams;
  if (!month || !year || !tab) return null;
  const schedules = (await getScheduleByMonthYear(month, year)) ?? null;
  return <SchedulePage schedules={schedules} tab={tab} />;
}
