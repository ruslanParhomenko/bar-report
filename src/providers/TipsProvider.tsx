"use client";

import { TipsFormType } from "@/features/tips/schema";
import { createContext, useContext } from "react";

export type TipsDataContext = {
  form_data: TipsFormType;
  unique_id: string;
};

const TipsContext = createContext<TipsDataContext[]>([]);

export const TipsProvider = ({
  data,
  children,
}: {
  data: TipsDataContext[];
  children: React.ReactNode;
}) => <TipsContext.Provider value={data}>{children}</TipsContext.Provider>;

export const useTips = () => useContext(TipsContext);
