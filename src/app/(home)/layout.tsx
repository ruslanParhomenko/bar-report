import SidebarNav from "@/features/sidebar/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import NavMenuHeader from "@/components/nav-menu-header/nav-menu";
import { AbilityProvider } from "@/providers/AbilityProvider";
import {
  EmployeesContextValue,
  EmployeesProvider,
} from "@/providers/EmployeesProvider";
import { getEmployees } from "../actions/employees/employeeAction";
import { getUsers } from "../actions/users/userAction";
import { Suspense } from "react";

const NavPage = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const employees = await getEmployees();
  const users = await getUsers();
  return (
    <AbilityProvider users={users}>
      <EmployeesProvider employees={employees as EmployeesContextValue[]}>
        <SidebarProvider>
          <SidebarNav />
          <div className="md:pl-2 w-full">
            <Suspense fallback={<div>Loading...</div>}>
              <NavMenuHeader />
            </Suspense>
            {children}
          </div>
        </SidebarProvider>
      </EmployeesProvider>
    </AbilityProvider>
  );
};

export default NavPage;
