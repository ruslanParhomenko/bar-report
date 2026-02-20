import { EmployeeForm } from "@/features/employees/employee/employee-form";
import UsersForm from "@/features/employees/users/users-form";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { tab } = await searchParams;
  const { id } = await params;

  if (!tab || !id) return null;

  if (tab === "create-employee") {
    return <EmployeeForm id={id} />;
  }

  if (tab === "create-user") {
    return <UsersForm id={id} />;
  }

  return null;
}
