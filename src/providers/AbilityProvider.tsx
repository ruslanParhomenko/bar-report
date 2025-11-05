"use client";

import { UsersSchemaTypeData } from "@/features/settings/users/schema";
import React, { createContext, useContext, useMemo } from "react";

type AbilityFlags = {
  isAdmin: boolean;
  isBar: boolean;
  isCucina: boolean;
  isObserver: boolean;
  isUser: boolean;
  isMngr: boolean;
  isCash: boolean;
};

type AbilityContextType = AbilityFlags & {
  query: UsersSchemaTypeData[];
};

const AbilityContext = createContext<AbilityContextType | null>(null);

export function AbilityProvider({
  children,
  users,
  serverAbility,
}: {
  children: React.ReactNode;
  users?: any[];
  serverAbility: AbilityFlags;
}) {
  const value = useMemo(() => {
    const ability = {
      ...serverAbility,
      isObserver:
        !serverAbility.isAdmin &&
        !serverAbility.isBar &&
        !serverAbility.isCucina &&
        !serverAbility.isUser &&
        !serverAbility.isMngr &&
        !serverAbility.isCash,
    };

    return { ...ability, query: users || [] };
  }, [serverAbility, users]);

  return (
    <AbilityContext.Provider value={value}>{children}</AbilityContext.Provider>
  );
}

export function useAbility() {
  const ctx = useContext(AbilityContext);
  if (!ctx) throw new Error("useAbility must be used inside AbilityProvider");
  return ctx;
}
