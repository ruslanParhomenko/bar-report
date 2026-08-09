import { getDataOrderProducts } from "@/app/actions/data-constants/data-order-products";
import { getUsers } from "@/app/actions/users/user-action";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
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
