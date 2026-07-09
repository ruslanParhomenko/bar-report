import { getScheduleByYear } from "@/app/actions/schedule/schedule-action";
import { getTipsByYear } from "@/app/actions/tips/tips-action";
import ChartResultPage from "@/features/chart-result/chart-result-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const {  year } = await searchParams;
  if ( !year) return null;

  const [schedules, tipsDataYear] = await Promise.all([
    getScheduleByYear(year),
    getTipsByYear(year),
  ]);
  return (
    <ChartResultPage
      dataSchedules={schedules}
      tipsDataYear={tipsDataYear}
      year={year}
    />
  );
}
