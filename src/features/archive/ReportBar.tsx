import ReportBarTable from "@/components/table/ReportBarTable";

export default function ReportBar({
  data,
  invalidate,
}: {
  data: any;
  invalidate?: () => void;
}) {
  return (
    <>
      {data.length > 0 &&
        data.map((item: any, index: number) => (
          <ReportBarTable key={index} data={item} invalidate={invalidate} />
        ))}
    </>
  );
}
