import { getScheduleByYear } from "@/app/actions/schedule/schedule-action";
import { getTipsByYear } from "@/app/actions/tips/tips-action";
import ChartResultPage from "@/features/chart-result/chart-result-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const [schedules, tipsDataYear] = await Promise.all([
    getScheduleByYear(year),
    getTipsByYear(year),
  ]);
  return (
    <ChartResultPage
      dataSchedules={schedules}
      tipsDataYear={tipsDataYear}
      month={month}
      year={year}
    />
  );
}
