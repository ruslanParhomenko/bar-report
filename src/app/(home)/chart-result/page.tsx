import { getScheduleByYearAndMonth } from "@/app/actions/schedule/schedule-action";
import { getTipsByYearAndMonth } from "@/app/actions/tips/tips-action";
import ChartResultPage from "@/features/chart-result/chart-result-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const [schedules, tipsData] = await Promise.all([
    getScheduleByYearAndMonth(year, month),
    getTipsByYearAndMonth(year, month),
  ]);
  return (
    <ChartResultPage
      dataSchedules={schedules}
      tipsData={tipsData}
      month={month}
      year={year}
    />
  );
}
