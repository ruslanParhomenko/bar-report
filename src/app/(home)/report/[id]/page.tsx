import { getReportBar } from "@/app/actions/archive/reportBarAction";
import { ReportBarData } from "@/constants/type";
import ReportBarFormById from "@/features/report/bar/ReportBarFormById";

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const report = await getReportBar(id as string);
  return <ReportBarFormById data={report as ReportBarData} />;
};
export default Page;
