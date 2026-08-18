import { getDataOrderProducts } from "@/features/settings/setting/actions/get-data-json";
import { OrdersPage } from "@/features/staff/orders";

export default async function Page() {
  const ordersData = await getDataOrderProducts();

  if (!ordersData) return null;
  return <OrdersPage orderProducts={ordersData} />;
}
