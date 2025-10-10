import RemarksTable from "@/components/table/RemarksTable";
import { RemarkData } from "@/constants/type";

export default function Remarks({
  data,
  invalidate,
}: {
  data: RemarkData[];
  invalidate?: () => void;
}) {
  if (!data?.length) return null;
  return (
    <>
      {data.map((item, index: number) => {
        if (!item.remarks?.length) return null;
        return <RemarksTable key={index} data={item} invalidate={invalidate} />;
      })}
    </>
  );
}
