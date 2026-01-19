import { ReportBarType } from "@/app/actions/archive/reportBarAction";
import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";

export default function ReportBar({ data }: { data: ReportBarType[] }) {
  return (
    <>
      {data.length > 0 &&
        data.map((item, index: number) => (
          <ReportBarTable key={index} data={item} />
        ))}
    </>
  );
}
