import { GetReportData } from "@/features/report-bar/model/type";
import ReportBarArchiveItem from "@/features/staff/archive/bar/report-bar-archive-item";

export const classNameHead = "text-shadow-muted-foreground font-bold";
export const classNameRowBorder = "border-b-bl";

export default function ReportBarArchive({
  data,
}: {
  data: GetReportData[] | null;
}) {
  if (!data) return null;

  const sortedData = [...data].sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <>
      {sortedData.map((item, index) => (
        <ReportBarArchiveItem
          key={item.id}
          item={item}
          defaultOpen={index === 0}
        />
      ))}
    </>
  );
}
