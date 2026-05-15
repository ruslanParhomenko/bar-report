import { getRemarksByYear } from "@/app/actions/remarks/remarks-action";
import ChartArchivePage from "@/features/chart-archive/chart-arhive-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const dataRemarks = await getRemarksByYear(String(year));

  const data = {
    dataRemarks: dataRemarks,
  };
  return <ChartArchivePage data={data} />;
}
