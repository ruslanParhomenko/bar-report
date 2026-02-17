import { getBreakListByDate } from "@/app/actions/break/break-action";
import { getRemarksByUniqueKey } from "@/app/actions/remarks/remarks-action";
import { getReportByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import { getReportCucinaByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import ArchivePage, { ArchiveData } from "@/features/archive/archive-page";
import { MONTHS } from "@/utils/get-month-days";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  const currentMonth = month ?? MONTHS[new Date().getMonth()];

  const currentYear = year ?? new Date().getFullYear().toString();

  const uniqueKey = `${currentYear}-${currentMonth}`;

  const [
    dataReportBar,
    dataBreak,
    dataReportCucina,
    dataRemarks,
    dataPenaltyGeneral,
  ] = await Promise.all([
    await getReportByUniqueKey(uniqueKey),
    await getBreakListByDate(uniqueKey),
    await getReportCucinaByUniqueKey(uniqueKey),
    await getRemarksByUniqueKey(uniqueKey),
    await getRemarksByUniqueKey(uniqueKey),
  ]);
  return (
    <ArchivePage
      archiveData={
        {
          bar: dataReportBar,
          breakList: dataBreak,
          cucina: dataReportCucina,
          penalty: dataRemarks,
          penaltyResult: dataPenaltyGeneral,
        } as ArchiveData
      }
    />
  );
}
