"use client";

import { GetUserData } from "@/features/users/actions/get-users";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useMemo } from "react";

type AbilityContextValue = {
  role: string;
  accessTabs: string[];
};

const AbilityContext = createContext<AbilityContextValue | null>(null);

export function AbilityProvider({
  children,
  users,
}: {
  children: React.ReactNode;
  users: GetUserData[];
}) {
  const session = useSession();

  const role = session?.data?.user.role!;
  const accessTabs = session?.data?.user.accessTabs || [];

  const value = useMemo(
    () => ({ role, accessTabs }),
    [role, accessTabs, users],
  );

  return (
    <AbilityContext.Provider value={value}>{children}</AbilityContext.Provider>
  );
}

export function useAbility() {
  const ctx = useContext(AbilityContext);
  if (!ctx) throw new Error("useAbility must be used inside AbilityProvider");
  return { role: ctx.role, accessTabs: ctx.accessTabs };
}
