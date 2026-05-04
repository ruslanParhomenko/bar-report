import { getRemarksByUniqueKey } from "@/app/actions/remarks/remarks-action";
import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
import { getTipsByYearAndMonth } from "@/app/actions/tips/tips-action";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { RESULT_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { remarksByUniqueEmployee } from "@/features/archive/penalty-details/utils";
import { PageResult } from "@/features/result/result-page";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;

  if (!month || !year) return null;
  // key
  const uniqueKey = `${year}-${month}`;

  const [schedule, remarks, tipsData] = await Promise.all([
    getScheduleByMonthYear(month, year),
    getRemarksByUniqueKey(uniqueKey),
    getTipsByYearAndMonth(year, month),
  ]);

  const remarksByEmployee =
    remarks && remarksByUniqueEmployee(remarks.data).formattedData;

  return (
    <ProtectedPage route={RESULT_MAIN_ROUTE}>
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
      />
    </ProtectedPage>
  );
}
