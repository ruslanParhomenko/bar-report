"use client";

import { createContext, useContext } from "react";

const CashContext = createContext<any>([]);

export const CashProvider = ({
  data,
  children,
}: {
  data: any[];
  children: React.ReactNode;
}) => {
  return <CashContext.Provider value={data}>{children}</CashContext.Provider>;
};

export const useCash = () => useContext(CashContext);
