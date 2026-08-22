import ChartResultPage from "@/features/chart/chart-result/chart-result-page";
import { getScheduleByYear } from "@/features/schedule/schedule-edit/actions/get-schedule";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { getTipsByYear } from "@/features/staff/tips/actions/get-tips";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;

  const [schedules, tipsDataYear, employees] = await Promise.all([
    getScheduleByYear(year),
    getTipsByYear(year),
    getEmployees(),
  ]);
  return (
    <ChartResultPage
      dataSchedules={schedules}
      tipsDataYear={tipsDataYear}
      employees={employees}
      year={year}
    />
  );
}
