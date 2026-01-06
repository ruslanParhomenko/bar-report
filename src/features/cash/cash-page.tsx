import { getMonthDays } from "@/utils/getMonthDays";
import { CashData } from "@/app/actions/cash/cashAction";
import CashForm from "./cash-form";

export function CashPage({
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
