import { EmployeeCreatePage } from "@/features/settings/create-employee";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { IdCardIcon } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, employees] = await Promise.all([params, getEmployees()]);

  if (!IdCardIcon) return null;

  return <EmployeeCreatePage employees={employees} id={id} />;
}
