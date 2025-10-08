import RemarksTable from "@/components/table/RemarksTable";
import { RemarkReport } from "@/generated/prisma";

export default function Remarks({
  data,
  invalidate,
}: {
  data: RemarkReport[];
  invalidate?: () => void;
}) {
  if (!data?.length) return null;
  return (
    <>
      {data.map((item: any, index: number) => {
        if (!item.remarks?.length) return null;
        return <RemarksTable key={index} data={item} invalidate={invalidate} />;
      })}
    </>
  );
}
