import SidebarNav from "@/features/sidebar/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AbilityProvider } from "@/providers/ability-provider";
import {
  EmployeesContextValue,
  EmployeesProvider,
} from "@/providers/employees-provider";
import { getEmployees } from "../actions/employees/employee-action";
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
