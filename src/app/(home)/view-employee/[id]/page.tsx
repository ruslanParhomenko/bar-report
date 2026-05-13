import EmployeePage from "@/features/view-employee/employee-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return null;

  return <EmployeePage id={id} />;
}
