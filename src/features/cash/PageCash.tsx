import { getMonthDays } from "@/utils/getMonthDays";
import { CashData } from "@/app/actions/cash/cashAction";
import CashForm from "./CashForm";

export function PageCash({
  dataCash,
  month,
  year,
}: {
  dataCash: CashData | null;
  month: string;
  year: string;
}) {
  if (!month || !year) return null;
  const monthDays = getMonthDays({ month, year });
  return (
    <CashForm
      dataCash={dataCash}
      monthDays={monthDays}
      month={month}
      year={year}
    />
  );
}
