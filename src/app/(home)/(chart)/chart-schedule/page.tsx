import ChartSchedulePage from "@/features/chart/chart-schedule/chart-schedule-page";
import { getScheduleByYear } from "@/features/staff/schedule/schedule-edit/actions/get-schedule";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;
  const schedules = await getScheduleByYear(year);
  return <ChartSchedulePage schedules={schedules} />;
}
