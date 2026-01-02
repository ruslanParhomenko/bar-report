import { getMonthDays } from "@/utils/getMonthDays";

import AOForm from "./AOForm";

export default function PageAo({
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
    <AOForm dataAo={dataAo} monthDays={monthDays} month={month} year={year} />
  );
}
