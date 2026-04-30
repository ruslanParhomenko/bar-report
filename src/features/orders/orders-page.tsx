"use client";

import { useHashParam } from "@/hooks/use-hash";
import { useOrderProducts } from "@/providers/order-products-provider";
import { OrderForm } from "./order-form";

export default function OrdersPage() {
  const [tab] = useHashParam("tab");

  const orderProducts = useOrderProducts();

  if (!orderProducts) {
    return null;
  }

  const DATA_COMPONENT_BY_TAB = {
    "bar-ttn": orderProducts.ttnBar || {},
    "bar-zn": orderProducts.bar || {},
    "cucina-ttn": orderProducts.ttnCucina || {},
    "cucina-zn": orderProducts.cucina || {},
  };

  return (
    <OrderForm
      key={tab}
      data={DATA_COMPONENT_BY_TAB[tab as keyof typeof DATA_COMPONENT_BY_TAB]}
      tab={tab as string}
    />
  );
}
