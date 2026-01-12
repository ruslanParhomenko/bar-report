import { getMonthDays } from "@/utils/getMonthDays";
import { CashData } from "@/app/actions/cash/cashAction";
import CashForm from "./cash-form";
import { AOContextValue } from "@/app/actions/a-o/ao-action";

export function CashPage({
  dataAo,
  dataCash,
  month,
  year,
}: {
  dataAo: AOContextValue | null;
  dataCash: CashData | null;
  month: string;
  year: string;
}) {
  if (!month || !year) return null;
  const monthDays = getMonthDays({ month, year });
  return (
    <CashForm
      dataAo={dataAo}
      dataCash={dataCash}
      monthDays={monthDays}
      month={month}
      year={year}
    />
  );
}
