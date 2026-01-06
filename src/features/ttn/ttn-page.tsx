import { getMonthDays } from "@/utils/getMonthDays";
import TTNForm from "./ttn-form";

export default function TTNPage({
  dataTtn,
  month,
  year,
}: {
  dataTtn: any | null;
  month: string;
  year: string;
}) {
  if (!month || !year) return null;
  const monthDays = getMonthDays({ month, year });
  return (
    <TTNForm
      dataTtn={dataTtn}
      monthDays={monthDays}
      month={month}
      year={year}
    />
  );
}
