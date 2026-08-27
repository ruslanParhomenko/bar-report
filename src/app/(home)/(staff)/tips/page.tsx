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

  const dataTipsYear = await getTipsByYear(year);
  const employees = await getEmployees();

  return <TipsPage dataTipsYear={dataTipsYear} employees={employees} />;
}
