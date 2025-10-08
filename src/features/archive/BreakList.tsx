import BreakTable from "@/components/table/BreakListTable";

export default function BreakListTable({
  data,
  invalidate,
}: {
  data: any[];
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
