import { remarksByUniqueEmployee } from "@/features/staff/archive/penalty/utils";
import { getRemarksByYearMonth } from "@/features/staff/bar/penalty/actions/get-penalty";
import { ResultPage } from "@/features/staff/result";

import { getScheduleByYearAndMonth } from "@/features/staff/schedule/actions/get-schedule";
import { getTipsByYearAndMonth } from "@/features/staff/tips/actions/get-tips";
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
    <ResultPage
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
