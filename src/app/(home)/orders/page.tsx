import OrdersPage from "@/features/orders/orders-page";

import { ProtectedPage } from "@/components/wrapper/protected-page";
import { ORDERS_MAIN_ROUTE } from "@/constants/endpoint-tag";

export default async function Page() {
  return (
    <ProtectedPage route={ORDERS_MAIN_ROUTE}>
      <OrdersPage />
    </ProtectedPage>
  );
}
