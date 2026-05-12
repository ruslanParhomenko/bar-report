import { EmployeesPage } from "@/features/employees/employees-page";
import { headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { tab, filter } = await searchParams;
  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";
  return <EmployeesPage isAdmin={isAdmin} tab={tab} filter={filter} />;
}
