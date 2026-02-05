import SidebarNav from "@/features/sidebar/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
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
  const employees = await getEmployees();
  const users = await getUsers();
  return (
    <AbilityProvider users={users}>
      <EmployeesProvider employees={employees as EmployeesContextValue[]}>
        <SidebarProvider>
          <SidebarNav />
          {children}
        </SidebarProvider>
      </EmployeesProvider>
    </AbilityProvider>
  );
};

export default NavPage;
