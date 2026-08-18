"use client";

import { GetUserData } from "@/features/settings/users/actions/get-users";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useMemo } from "react";

type Ability = {
  isAdmin: boolean;
  isBar: boolean;
  isCucina: boolean;
  isUser: boolean;
  isManager: boolean;
  isCash: boolean;
  isFin: boolean;
  isSCR: boolean;
  isTech: boolean;
};

type AbilityContextValue = {
  ability: Ability;
};

const AbilityContext = createContext<AbilityContextValue | null>(null);

function computeAbility(role: string): Ability {
  return {
    isAdmin: role === "ADMIN",
    isBar: role === "BAR",
    isCucina: role === "CUCINA",
    isUser: role === "USER",
    isManager: role === "MNGR",
    isCash: role === "CASH",
    isFin: role === "FIN",
    isSCR: role === "SCR",
    isTech: role === "TECH",
  };
}

export function AbilityProvider({
  children,
  users,
}: {
  children: React.ReactNode;
  users: GetUserData[];
}) {
  const { data: session } = useSession();

  const ability = useMemo(() => {
    const role = (session?.user as any)?.role ?? "OBSERVER";
    return computeAbility(role);
  }, [session?.user]);

  const value = useMemo(() => ({ ability }), [ability, users]);

  return (
    <AbilityContext.Provider value={value}>{children}</AbilityContext.Provider>
  );
}

export function useAbility() {
  const ctx = useContext(AbilityContext);
  if (!ctx) throw new Error("useAbility must be used inside AbilityProvider");
  return { ...ctx.ability };
}
