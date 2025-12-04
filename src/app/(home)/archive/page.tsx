import { getReportBarByDate } from "@/app/actions/archive/reportBarAction";
import { getReportsCucinaByDate } from "@/app/actions/archive/reportCucinaAction";
import { ReportBarData, ReportCucinaData } from "@/constants/type";
import { ArchivePage } from "@/features/archive/ArchiveForm";
import ReportBar from "@/features/archive/ReportBar";
import ReportCucina from "@/features/archive/ReportCucina";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { tab, month, year } = await searchParams;
  if (!tab || !month || !year) return null;
  const monthNum = Number(month);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  //  UTC
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));

  // get data
  const dataReportBar =
    tab === "bar" &&
    (
      await getReportBarByDate({
        startDate,
        endDate,
      })
    ).reports;
  const dataReportCucina =
    tab === "cucina" &&
    (
      await getReportsCucinaByDate({
        startDate,
        endDate,
      })
    ).reports;

  if (tab === "bar")
    return <ReportBar data={dataReportBar as ReportBarData[]} />;
  else if (tab === "cucina")
    return <ReportCucina data={dataReportCucina as ReportCucinaData[]} />;
  else return null;
}
