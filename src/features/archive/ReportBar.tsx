import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";
import { ReportBarData } from "@/constants/type";

export default function ReportBar({ data }: { data: ReportBarData[] }) {
  return (
    <>
      {data.length > 0 &&
        data.map((item: ReportBarData, index: number) => (
          <ReportBarTable key={index} data={item} />
        ))}
    </>
  );
}
