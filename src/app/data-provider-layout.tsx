"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { AbilityProvider } from "@/providers/AbilityProvider";

import {
  EmployeesContextValue,
  EmployeesProvider,
} from "@/providers/EmployeesProvider";

import { getEmployees } from "./actions/employees/employeeAction";
import { getUsers } from "./actions/users/userAction";

export async function UsersEmployeesProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const employees = await getEmployees();

  const users = await getUsers();

  const email = session?.user?.email ?? null;
  const user = users.find((u) => u.mail === email);

  const ability = {
    isAdmin: email === "parhomenkogm@gmail.com" || user?.role === "ADMIN",
    isBar: user?.role === "BAR",
    isCucina: user?.role === "CUCINA",
    isUser: user?.role === "USER",
    isManager: user?.role === "MNGR",
    isCash: user?.role === "CASH",
    isFin: user?.role === "FIN",
    isObserver: user?.role === "OBSERVER",
  };
  return (
    <AbilityProvider users={users} serverAbility={ability}>
      <EmployeesProvider employees={employees as EmployeesContextValue[]}>
        {children}
      </EmployeesProvider>
    </AbilityProvider>
  );
}
