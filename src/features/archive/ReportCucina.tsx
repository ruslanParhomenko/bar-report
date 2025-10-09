import ReportCucinaTable from "@/components/table/ReportCucinaTable";
export default function ReportCucina({
  data,
  invalidate,
}: {
  data: any;
  invalidate?: () => void;
}) {
  console.log("data cucina", data);
  return (
    <>
      {data.length > 0 &&
        data.map((report: any, index: number) => (
          <ReportCucinaTable
            key={index}
            data={report}
            invalidate={invalidate}
          />
        ))}
    </>
  );
}
