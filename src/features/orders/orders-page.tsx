"use client";

import { useOrderProducts } from "@/providers/order-products-provider";
import { useSearchParams } from "next/navigation";
import { OrderForm } from "./order-form";

export default function OrdersPage() {
  const tab = useSearchParams().get("tab");
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
