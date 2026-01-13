import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { AddEmployeeCard } from "@/features/employees/AddEmployeeCard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "MNGR"];

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;
  return <AddEmployeeCard employee={null} />;
}
