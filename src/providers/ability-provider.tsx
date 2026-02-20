"use client";
import { UsersSchemaTypeData } from "@/features/employees/users/schema";
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
  isSCR: boolean;
};

type AbilityContextValue = {
  ability: Ability;
  users: UsersSchemaTypeData[];
};

const AbilityContext = createContext<AbilityContextValue | null>(null);

export function AbilityProvider({
  children,
  users,
}: {
  children: React.ReactNode;
  users: UsersSchemaTypeData[];
}) {
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
    isSCR: role === "SCR",
  };

  return (
    <AbilityContext.Provider value={{ ability, users }}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const ctx = useContext(AbilityContext);
  if (!ctx) throw new Error("useAbility must be used inside AbilityProvider");
  return { ...ctx.ability, users: ctx.users };
}
