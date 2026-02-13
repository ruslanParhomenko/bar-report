import SidebarNav from "@/features/sidebar/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AbilityProvider } from "@/providers/AbilityProvider";
import {
  EmployeesContextValue,
  EmployeesProvider,
} from "@/providers/EmployeesProvider";
import { getEmployees } from "../actions/employees/employeeAction";
import NavTabs from "@/components/nav/nav-tabs";

const NavPage = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const employees = await getEmployees();
  return (
    <AbilityProvider>
      <EmployeesProvider employees={employees as EmployeesContextValue[]}>
        <SidebarProvider>
          <SidebarNav />
          <div className="flex flex-col h-screen w-screen overflow-y-auto">
            <NavTabs />
            {children}
          </div>
        </SidebarProvider>
      </EmployeesProvider>
    </AbilityProvider>
  );
};

export default NavPage;
