import { BreakListData } from "@/constants/type";
import { BreakTableByData } from "../break/BreakTableByData";

export async function BreakListPageByData({
  dataRemarks,
}: {
  dataRemarks: BreakListData[];
}) {
  return <BreakTableByData data={dataRemarks ?? []} />;
}
