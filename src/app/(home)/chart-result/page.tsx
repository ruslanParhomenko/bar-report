import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
import { getTipsByYearAndMonth } from "@/app/actions/tips/tips-action";
import ChartResultPage from "@/features/chart-result/chart-result-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const [schedule, tipsData] = await Promise.all([
    getScheduleByMonthYear(month, year),
    getTipsByYearAndMonth(year, month),
  ]);
  return (
    <ChartResultPage
      dataSchedule={schedule}
      tipsData={tipsData}
      month={month}
      year={year}
    />
  );
}
