import {
  getReportsCucinaByDate,
  ReportCucinaData,
} from "@/app/actions/archive/reportCucinaAction";
import { getReportByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import ReportCucina from "@/features/archive/ReportCucina";
import { checkAccess } from "@/lib/check-access";
import { MONTHS } from "@/utils/getMonthDays";

const SET_ACCESS = ["ADMIN", "CUCINA", "MNGR", "USER"];

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ patch: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const uniqueKey = `${year}-${month}`;

  const monthNum = Number(MONTHS.indexOf(month) + 1);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  //  UTC
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));

  // get data

  const dataReportCucina = (
    await getReportsCucinaByDate({
      startDate,
      endDate,
    })
  ).reports;

  return <ReportCucina data={dataReportCucina as ReportCucinaData[]} />;
}
