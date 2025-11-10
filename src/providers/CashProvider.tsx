"use client";

import { CashFormType } from "@/features/cash/schema";
import { createContext, useContext } from "react";

export type CashContextType = {
  form_data: CashFormType;
  unique_id: string;
};

const CashContext = createContext<CashContextType[]>([]);

export const CashProvider = ({
  data,
  children,
}: {
  data: CashContextType[];
  children: React.ReactNode;
}) => {
  return <CashContext.Provider value={data}>{children}</CashContext.Provider>;
};

export const useCash = () => useContext(CashContext);
