import ChartArchivePage from "@/features/chart/chart-archive/chart-arhive-page";
import { getRemarksByYear } from "@/features/penalty/actions/get-penalty";
import { getTipsAddByYear } from "@/features/tips-add/actions/get-tips-add";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const dataRemarks = await getRemarksByYear(String(year));
  const dataTips = await getTipsAddByYear(String(year));

  const data = {
    dataRemarks: dataRemarks,
    dataTips: dataTips,
  };
  return <ChartArchivePage data={data} />;
}
