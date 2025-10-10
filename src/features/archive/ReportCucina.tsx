import ReportCucinaTable from "@/components/table/report-cucina-table/ReportCucinaTable";
import { ReportCucinaData } from "@/constants/type";

export default function ReportCucina({
  data,
  invalidate,
}: {
  data: ReportCucinaData[];
  invalidate?: () => void;
}) {
  return (
    <>
      {data.length > 0 &&
        data.map((report, index: number) => (
          <ReportCucinaTable
            key={index}
            data={report}
            invalidate={invalidate}
          />
        ))}
    </>
  );
}
