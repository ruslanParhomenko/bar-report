"use client";

import { createDataOrderProducts } from "@/app/actions/data-constants/data-order-products";

import { createContext, useContext } from "react";

export type OrderProductsContextValue = createDataOrderProducts;

const OrderProductsContext = createContext<OrderProductsContextValue | null>(
  null,
);

export function OrderProductsProvider({
  orderProducts,
  children,
}: {
  orderProducts: OrderProductsContextValue | null;
  children: React.ReactNode;
}) {
  return (
    <OrderProductsContext.Provider value={orderProducts ?? null}>
      {children}
    </OrderProductsContext.Provider>
  );
}

export const useOrderProducts = () => useContext(OrderProductsContext);
