import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { getDataOrderProducts } from "@/features/settings/setting/actions/get-data-json";
import { getUsers } from "@/features/settings/users/actions/get-users";
import { AbilityProvider } from "@/providers/ability-provider";
import { EmployeesProvider } from "@/providers/employees-provider";
import { OrderProductsProvider } from "@/providers/order-products-provider";

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
        <OrderProductsProvider orderProducts={ordersProducts}>
          {children}
        </OrderProductsProvider>
      </EmployeesProvider>
    </AbilityProvider>
  );
}
