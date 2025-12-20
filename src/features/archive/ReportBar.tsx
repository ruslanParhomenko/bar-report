import { ReportDataById } from "@/app/actions/archive/reportBarAction";
import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";

export default function ReportBar({ data }: { data: ReportDataById[] }) {
  return (
    <>
      {data.length > 0 &&
        data.map((item: ReportDataById, index: number) => (
          <ReportBarTable key={index} data={item} />
        ))}
    </>
  );
}
