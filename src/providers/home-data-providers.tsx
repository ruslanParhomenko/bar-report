import { getDataOrderProducts } from "@/app/actions/data-constants/data-order-products";
import { getEmployees } from "@/app/actions/employees/employee-action";
import { getUsers } from "@/app/actions/users/user-action";
import { AbilityProvider } from "@/providers/ability-provider";
import { EmployeesProvider } from "@/providers/employees-provider";
import {
  OrderProductsContextValue,
  OrderProductsProvider,
} from "@/providers/order-products-provider";

export default async function HomeDataProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [employees, users, ordersProducts] = await Promise.all([
    getEmployees(),
    getUsers(),
    getDataOrderProducts(),
  ]);

  return (
    <AbilityProvider users={users}>
      <EmployeesProvider employees={employees}>
        <OrderProductsProvider
          orderProducts={ordersProducts as OrderProductsContextValue}
        >
          {children}
        </OrderProductsProvider>
      </EmployeesProvider>
    </AbilityProvider>
  );
}
