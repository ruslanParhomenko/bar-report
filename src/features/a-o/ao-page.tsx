import { getMonthDays } from "@/utils/getMonthDays";

import AoForm from "./ao-form";
import { AOContextValue } from "@/app/actions/a-o/ao-action";

export default function AoPage({
  dataAo,
  month,
  year,
}: {
  dataAo: AOContextValue | null;
  month: string;
  year: string;
}) {
  if (!month || !year) return null;
  const monthDays = getMonthDays({ month, year });
  return (
    <AoForm dataAo={dataAo} monthDays={monthDays} month={month} year={year} />
  );
}
