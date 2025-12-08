import { getBreakListByDate } from "@/app/actions/archive/breakListAction";
import { BreakListPageByData } from "@/features/break-remarks/BreakListPageByData";
import { MONTHS } from "@/utils/getMonthDays";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const monthNum = Number(MONTHS.indexOf(month) + 1);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  //  UTC
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));

  // get data
  const dataRemarks = await getBreakListByDate({
    startDate,
    endDate,
  });
  return <BreakListPageByData dataRemarks={dataRemarks.breakList} />;
}
