import BreakTable from "@/components/table/BreakListTable";
import { BreakListData } from "@/constants/type";

export default function BreakListTable({
  data,
  invalidate,
}: {
  data: BreakListData[];
  invalidate?: () => void;
}) {
  return (
    <>
      {data?.length > 0 &&
        data.map((item, index) => {
          if (!item.rows || item.rows.length === 0) return null;
          return <BreakTable key={index} data={item} invalidate={invalidate} />;
        })}
    </>
  );
}
