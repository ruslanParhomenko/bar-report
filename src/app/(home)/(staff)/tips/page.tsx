import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { TipsPage } from "@/features/staff/tips";
import { getTipsByYear } from "@/features/staff/tips/actions/get-tips";
import { getTipsAddByYearMonth } from "@/features/tips-add/actions/get-tips-add";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { year, month } = await searchParams;
  if (!year || !month) return null;

  const [dataTipsYear, employees, dataTipsAdd] = await Promise.allSettled([
    getTipsByYear(year),
    getEmployees(),
    getTipsAddByYearMonth(year, month),
  ]);

  return (
    <TipsPage
      dataTipsAdd={
        dataTipsAdd.status === "fulfilled" ? dataTipsAdd.value : null
      }
      dataTipsYear={
        dataTipsYear.status === "fulfilled" ? dataTipsYear.value : null
      }
      employees={employees.status === "fulfilled" ? employees.value : null}
    />
  );
}
