import { getRemarksByDay } from "@/features/penalty/actions/get-penalty";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";

import PenaltyUpdate from "@/features/staff/penalty-update/penalty-update";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id } = await params;
  const { month, year } = await searchParams;
  if (!month || !year || !id) return null;

  const day = id;

  const [dataPenaltyByDay, employees] = await Promise.all([
    getRemarksByDay(year, month, day),
    getEmployees(),
  ]);

  if (!dataPenaltyByDay || !employees) return null;

  return (
    <PenaltyUpdate
      dataPenaltyByDay={dataPenaltyByDay}
      employees={employees}
      month={month}
      year={year}
      day={day}
    />
  );
}
