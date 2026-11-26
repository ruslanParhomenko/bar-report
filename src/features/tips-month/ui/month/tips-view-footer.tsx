import { GetTipsData } from "@/features/tips-month/model/type";
import { calculateTipsTotal } from "../../lib/utils";

export function TipsInfo({ data }: { data: GetTipsData["tipsData"] }) {
  if (!data) return null;

  const { totalAll: totalTips } = calculateTipsTotal(data.rowEmployeesTips);
  const totalCash = data.rowCashTips?.reduce(
    (acc: number, val: string) => acc + Number(val || 0),
    0,
  );

  return (
    <div className="mt-4 flex h-18 flex-row items-center justify-center gap-8 border-b-2">
      <div className="text-bl text-center text-xs">
        total tips: <span className="pl-2 font-bold">{totalTips}</span>
      </div>
      <div className="text-gn text-center text-xs">
        total cash: <span className="pl-2 font-bold">{totalCash}</span>
      </div>
      <div className="text-rd text-center text-xs">
        difference:{" "}
        <span className="pl-2 font-bold">{totalTips - totalCash}</span>
      </div>
    </div>
  );
}
