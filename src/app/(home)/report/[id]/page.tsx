import { getReportBar } from "@/app/actions/archive/reportBarAction";
import { ReportBarData } from "@/constants/type";
import ReportBarFormById from "@/features/report/bar/ReportBarFormById";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReportBar(id as string);
  return <ReportBarFormById data={report as ReportBarData} />;
}
