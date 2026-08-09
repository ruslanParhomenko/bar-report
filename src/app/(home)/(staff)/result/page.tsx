import { getTipsByYearAndMonth } from "@/app/actions/tips/tips-action";
import { remarksByUniqueEmployee } from "@/features/staff/archive/penalty/utils";
import { getRemarksByYearMonth } from "@/features/staff/bar/penalty/actions/get-penalty";
import { PageResult } from "@/features/staff/result/result-page";
import { getScheduleByYearAndMonth } from "@/features/staff/schedule/actions/get-schedule";
import { headers } from "next/headers";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;

  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";

  if (!month || !year) return null;

  const [schedules, remarks, tipsData] = await Promise.all([
    getScheduleByYearAndMonth(year, month),
    getRemarksByYearMonth(year, month),
    getTipsByYearAndMonth(year, month),
  ]);

  const remarksByEmployee =
    remarks && remarksByUniqueEmployee(remarks).formattedData;

  return (
    <PageResult
      dataSchedules={schedules}
      dataRemarks={
        remarksByEmployee as ReturnType<
          typeof remarksByUniqueEmployee
        >["formattedData"]
      }
      tipsData={tipsData}
      month={month}
      year={year}
      isAdmin={isAdmin}
    />
  );
}
