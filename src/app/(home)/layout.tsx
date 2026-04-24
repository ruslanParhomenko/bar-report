import NavTabs from "@/components/nav/nav-tabs";
import { SidebarToggleButton } from "@/components/sidebar/sidebar-toggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "@/features/sidebar/sidebar-nav";
import { AbilityProvider } from "@/providers/ability-provider";
import ClientRefProvider from "@/providers/client-ref-provider";
import {
  EmployeesContextValue,
  EmployeesProvider,
} from "@/providers/employees-provider";
import {
  OrderProductsContextValue,
  OrderProductsProvider,
} from "@/providers/order-products-provider";
import { getDataOrderProducts } from "../actions/data-constants/data-order-products";
import { getEmployees } from "../actions/employees/employee-action";
import { getUsers } from "../actions/users/user-action";

import MonthDaysProvider from "@/providers/month-days-provider";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [employees, users, ordersProducts] = await Promise.all([
    getEmployees(),
    getUsers(),
    getDataOrderProducts(),
  ]);

  return (
    <AbilityProvider users={users}>
      <EmployeesProvider employees={employees as EmployeesContextValue[]}>
        <OrderProductsProvider
          orderProducts={ordersProducts as OrderProductsContextValue}
        >
          <SidebarProvider>
            <SidebarToggleButton />
            <SidebarNav />
            <div className="flex h-screen w-screen flex-col overflow-y-auto px-1">
              <NavTabs />
              <ClientRefProvider>
                <MonthDaysProvider>{children}</MonthDaysProvider>
              </ClientRefProvider>
            </div>
          </SidebarProvider>
        </OrderProductsProvider>
      </EmployeesProvider>
    </AbilityProvider>
  );
}
