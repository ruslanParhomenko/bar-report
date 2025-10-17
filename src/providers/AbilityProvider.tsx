"use client";

import { UsersSchemaTypeData } from "@/features/settings/schema";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

type AbilityContextType = {
  isAdmin: boolean;
  isBar: boolean;
  isCucina: boolean;
  isObserver: boolean;
  isUser: boolean;
  isMngr: boolean;
  query: UsersSchemaTypeData[];
};

const AbilityContext = createContext<AbilityContextType | null>(null);

export function AbilityProvider({
  children,
  users,
}: {
  children: React.ReactNode;
  users: any[];
}) {
  const { data } = useSession();
  const [ability, setAbility] = useState({
    isAdmin: false,
    isBar: false,
    isCucina: false,
    isObserver: true,
    isUser: false,
    isMngr: false,
  });

  useEffect(() => {
    const mail = data?.user?.email;
    if (!mail) return;
    const userData = users || [];

    if (!mail) return;

    const isAdmin =
      mail === "parhomenkogm@gmail.com" ||
      userData.some((u) => u.role === "ADMIN" && u.mail === mail);
    const isBar = userData.some((u) => u.role === "BAR" && u.mail === mail);
    const isCucina = userData.some(
      (u) => u.role === "CUCINA" && u.mail === mail
    );
    const isUser = userData.some((u) => u.role === "USER" && u.mail === mail);
    const isMngr = userData.some((u) => u.role === "MNGR" && u.mail === mail);

    setAbility({
      isAdmin,
      isBar,
      isCucina,
      isObserver: !isAdmin && !isBar && !isCucina && !isUser && !isMngr,
      isUser,
      isMngr,
    });
  }, [data?.user?.email, users]);

  const value = useMemo(
    () => ({
      ...ability,
      query: users || [],
    }),
    [ability, users]
  );

  return (
    <AbilityContext.Provider value={value}>{children}</AbilityContext.Provider>
  );
}

export function useAbility() {
  const ctx = useContext(AbilityContext);
  if (!ctx) throw new Error("useAbility must be used inside AbilityProvider");
  return ctx;
}
