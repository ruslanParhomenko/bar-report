import { getRemarksByYearMonth } from "@/app/actions/remarks/remarks-action";
import { getScheduleByYearAndMonth } from "@/app/actions/schedule/schedule-action";
import { getTipsByYearAndMonth } from "@/app/actions/tips/tips-action";
import { remarksByUniqueEmployee } from "@/features/archive/penalty/utils";
import { PageResult } from "@/features/result/result-page";
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
