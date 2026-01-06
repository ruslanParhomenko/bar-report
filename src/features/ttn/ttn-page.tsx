import { getMonthDays } from "@/utils/getMonthDays";
import TTNForm from "./ttn-form";
import { TTNGetDataType } from "@/app/actions/ttn/ttn-actions";

export default function TTNPage({
  dataTtn,
  month,
  year,
}: {
  dataTtn: TTNGetDataType | null;
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
