import { getReportBar } from "@/app/actions/archive/reportBarAction";
import { ReportBarData } from "@/constants/type";
import ReportBarForm from "@/features/report/bar/ReportBarForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return null;
  const report = await getReportBar(id as string);

  return <ReportBarForm report={report as ReportBarData} />;
}
