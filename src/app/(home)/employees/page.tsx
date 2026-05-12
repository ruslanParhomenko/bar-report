import { EmployeesPage } from "@/features/employees/employees-page";
import { headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { tab, filter } = await searchParams;
  if (!tab || !filter) return null;
  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";
  return <EmployeesPage isAdmin={isAdmin} tab={tab} filter={filter} />;
}
