import { getEmployees } from "@/app/actions/employees/employeeAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { EmployeesPage } from "@/features/employees/EmployeesPage";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const CLOSE_ACCESS = ["OBSERVER"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (CLOSE_ACCESS.includes(session.user?.role ?? ""))
    return <InsufficientRights />;

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";
  const { role } = await searchParams;
  const data = await getEmployees();
  const employees =
    role === "all" ? data : data.filter((e: any) => e.role === role);
  return <EmployeesPage employees={employees as any} isAdmin={isAdmin} />;
}
