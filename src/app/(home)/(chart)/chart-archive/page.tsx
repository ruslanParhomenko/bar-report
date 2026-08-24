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

  const [dataRemarks, dataTips] = await Promise.allSettled([
    getRemarksByYear(String(year)),
    getTipsAddByYear(String(year)),
  ]);

  const data = {
    dataRemarks: dataRemarks.status === "fulfilled" ? dataRemarks.value : null,
    dataTips: dataTips.status === "fulfilled" ? dataTips.value : null,
  };

  return <ChartArchivePage data={data} />;
}
