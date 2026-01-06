import { getMonthDays } from "@/utils/getMonthDays";

import AoForm from "./ao-form";

export default function AoPage({
  dataAo,
  month,
  year,
}: {
  dataAo: any | null;
  month: string;
  year: string;
}) {
  if (!month || !year) return null;
  const monthDays = getMonthDays({ month, year });
  return (
    <AoForm dataAo={dataAo} monthDays={monthDays} month={month} year={year} />
  );
}
