import { getScheduleByYear } from "@/app/actions/schedule/schedule-action";
import ChartSchedulePage from "@/features/chart-schedule/chart-schedule-page";

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
