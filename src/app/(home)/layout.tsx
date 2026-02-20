import SidebarNav from "@/features/sidebar/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AbilityProvider } from "@/providers/ability-provider";
import {
  EmployeesContextValue,
  EmployeesProvider,
} from "@/providers/employees-provider";
import { getEmployees } from "../actions/employees/employee-action";
import NavTabs from "@/components/nav/nav-tabs";
import ClientRefProvider from "@/providers/client-ref-provider";
import { getUsers } from "../actions/users/user-action";

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
          <div className="flex flex-col h-screen w-screen overflow-y-auto p-1">
            <NavTabs />
            <ClientRefProvider>{children}</ClientRefProvider>
          </div>
        </SidebarProvider>
      </EmployeesProvider>
    </AbilityProvider>
  );
};

export default NavPage;
