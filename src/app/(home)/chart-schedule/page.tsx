import { getScheduleByYearAndMonth } from "@/app/actions/schedule/schedule-action";
import ChartSchedulePage from "@/features/chart-schedule/chart-schedule-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const schedules = await getScheduleByYearAndMonth(year, month);
  return <ChartSchedulePage schedules={schedules} />;
}
