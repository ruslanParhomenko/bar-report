import { EmployeeForm } from "@/features/employees/employee/employee-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return null;

  return <EmployeeForm id={id} />;
}
