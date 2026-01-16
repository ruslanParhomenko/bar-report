import SidebarNav from "@/features/sidebar/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { redirect } from "next/navigation";
import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";
import { AbilityProvider } from "@/providers/AbilityProvider";
import {
  EmployeesContextValue,
  EmployeesProvider,
} from "@/providers/EmployeesProvider";
import { getEmployees } from "../actions/employees/employeeAction";
import { getUsers } from "../actions/users/userAction";

const NavPage = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
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
  };
  return (
    <AbilityProvider users={users} serverAbility={ability}>
      <EmployeesProvider employees={employees as EmployeesContextValue[]}>
        <SidebarProvider>
          <SidebarNav />
          <div className="pl-2 w-full">
            <NavMenuHeader />
            {children}
          </div>
        </SidebarProvider>
      </EmployeesProvider>
    </AbilityProvider>
  );
};

export default NavPage;
