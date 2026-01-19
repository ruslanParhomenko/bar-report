"use client";

import { UsersSchemaTypeData } from "@/features/users/schema";
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

export function AbilityProvider({
  children,
  users,
}: {
  children: React.ReactNode;
  users: any[];
}) {
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email ?? null;
  const user = users.find((u) => u.mail === currentUserEmail);
  const ability: Ability = {
    isAdmin:
      currentUserEmail === "parhomenkogm@gmail.com" || user?.role === "ADMIN",
    isBar: user?.role === "BAR",
    isCucina: user?.role === "CUCINA",
    isUser: user?.role === "USER",
    isManager: user?.role === "MNGR",
    isCash: user?.role === "CASH",
    isFin: user?.role === "FIN",
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
