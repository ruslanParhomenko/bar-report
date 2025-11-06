"use client";

import { RemarkData } from "@/constants/type";
import { createContext, useContext } from "react";

const RemarksContext = createContext<RemarkData[]>([]);

export const RemarksProvider = ({
  data,
  children,
}: {
  data: RemarkData[];
  children: React.ReactNode;
}) => (
  <RemarksContext.Provider value={data}>{children}</RemarksContext.Provider>
);

export const useRemarks = () => useContext(RemarksContext);
