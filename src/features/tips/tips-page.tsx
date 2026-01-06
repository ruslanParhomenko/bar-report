import { getMonthDays } from "@/utils/getMonthDays";
import { TipsData } from "@/app/actions/tips/tipsAction";

import { CashData } from "@/app/actions/cash/cashAction";
import TipsForm from "./tips-form";

export function TipsPage({
  dataTips,
  dataCash,
  month,
  year,
}: {
  dataTips: TipsData | null;
  dataCash: CashData | null;
  month: string;
  year: string;
}) {
  if (!month || !year) return null;
  const monthDays = getMonthDays({ month, year });

  return (
    <TipsForm
      dataTips={dataTips}
      dataCash={dataCash}
      monthDays={monthDays}
      month={month}
      year={year}
    />
  );
}
