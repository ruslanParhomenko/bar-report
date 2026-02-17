"use client";

import { createContext, ReactNode, RefObject, useRef } from "react";

export const RefContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null);

export default function ClientRefProvider({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <RefContext.Provider value={ref}>
      <div ref={ref}>{children}</div>
    </RefContext.Provider>
  );
}
