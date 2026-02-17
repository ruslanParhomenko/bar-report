"use client";
import { useSession } from "next-auth/react";
import React, { createContext, useContext } from "react";

type Ability = {
  isAdmin: boolean;
  isBar: boolean;
  isCucina: boolean;
  isUser: boolean;
  isManager: boolean;
  isCash: boolean;
  isFin: boolean;
};

const AbilityContext = createContext<Ability | null>(null);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  const role = (session?.user as any)?.role ?? "OBSERVER";

  const ability: Ability = {
    isAdmin: role === "ADMIN",
    isBar: role === "BAR",
    isCucina: role === "CUCINA",
    isUser: role === "USER",
    isManager: role === "MNGR",
    isCash: role === "CASH",
    isFin: role === "FIN",
  };

  return (
    <AbilityContext.Provider value={{ ...ability }}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const ctx = useContext(AbilityContext);
  if (!ctx) throw new Error("useAbility must be used inside AbilityProvider");
  return ctx;
}
