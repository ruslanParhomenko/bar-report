"use client";

import { DataOrderProducts } from "@/features/settings/setting/model/type";
import { createContext, useContext } from "react";

const OrderProductsContext = createContext<DataOrderProducts | null>(null);

export function OrderProductsProvider({
  orderProducts,
  children,
}: {
  orderProducts: DataOrderProducts | null;
  children: React.ReactNode;
}) {
  return (
    <OrderProductsContext.Provider value={orderProducts ?? null}>
      {children}
    </OrderProductsContext.Provider>
  );
}

export const useOrderProducts = () => useContext(OrderProductsContext);
