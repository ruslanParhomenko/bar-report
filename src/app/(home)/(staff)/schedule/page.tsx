import { SchedulePage } from "@/features/staff/schedule";
import { getScheduleByYearAndMonth } from "@/features/staff/schedule/actions/get-schedule";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const schedules = await getScheduleByYearAndMonth(year, month);
  return <SchedulePage schedules={schedules} />;
}
