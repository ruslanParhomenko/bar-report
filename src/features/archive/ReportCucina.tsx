import ReportCucinaTable from "@/components/table/report-cucina-table/ReportCucinaTable";
import { ReportCucinaData } from "@/constants/type";

export default function ReportCucina({ data }: { data: ReportCucinaData[] }) {
  return (
    <>
      {data.length > 0 &&
        data.map((report, index: number) => (
          <ReportCucinaTable key={index} data={report} />
        ))}
    </>
  );
}
