import { getRemarksByYearMonth } from "@/app/actions/remarks/remarks-action";
import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
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

  const [schedule, remarks, tipsData] = await Promise.all([
    getScheduleByMonthYear(month, year),
    getRemarksByYearMonth(year, month),
    getTipsByYearAndMonth(year, month),
  ]);

  const remarksByEmployee =
    remarks && remarksByUniqueEmployee(remarks).formattedData;

  return (
    <PageResult
      dataSchedule={schedule}
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
