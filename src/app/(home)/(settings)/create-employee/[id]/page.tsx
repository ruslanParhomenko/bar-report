import { EmployeeCreatePage } from "@/features/settings/create-employee";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return null;

  return <EmployeeCreatePage id={id} />;
}
