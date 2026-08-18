import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { SchedulePage } from "@/features/staff/schedule";
import { getScheduleByYearAndMonth } from "@/features/staff/schedule/actions/get-schedule";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const [schedules, employees] = await Promise.all([
    getScheduleByYearAndMonth(year, month),
    getEmployees(),
  ]);
  return <SchedulePage schedules={schedules} employees={employees} />;
}
