import { getRemarksByYear } from "@/app/actions/remarks/remarks-action";
import { getTipsAddByYear } from "@/app/actions/tips-add/tips-add-actions";
import ChartArchivePage from "@/features/chart-archive/chart-arhive-page";

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
