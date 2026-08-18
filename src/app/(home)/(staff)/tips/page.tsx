import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { TipsPage } from "@/features/staff/tips";
import { getTipsByYear } from "@/features/staff/tips/actions/get-tips";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { year } = await searchParams;
  if (!year) return null;

  const [dataTipsYear, employees] = await Promise.all([
    getTipsByYear(year),
    getEmployees(),
  ]);

  return <TipsPage dataTipsYear={dataTipsYear} employees={employees} />;
}
