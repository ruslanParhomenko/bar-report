"use client";

import { useApi } from "@/hooks/useApi";
import { User } from "@/hooks/useGoogleData";
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
  query: User[];
};

const AbilityContext = createContext<AbilityContextType | null>(null);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const { data } = useSession();

  // const { users, isLoading } = useGoogleData();
  const { query } = useApi<User>({ endpoint: "users", queryKey: "users" });
  const { data: users, isLoading } = query;

  const [ability, setAbility] = useState({
    isAdmin: false,
    isBar: false,
    isCucina: false,
    isObserver: true,
    isUser: false,
    isMngr: false,
  });

  useEffect(() => {
    if (isLoading) return;
    const mail = data?.user?.email;
    const userData = users || [];

    if (!mail) return;

    const isAdmin =
      mail === "parhomenkogm@gmail.com" ||
      mail === "lavandavazat5@gmail.com" ||
      userData.some((u) => u.role === "ADMIN" && u.mail === mail);
    const isBar =
      mail === "cng.nv.rstrnt@gmail.com" ||
      userData.some((u) => u.role === "BAR" && u.mail === mail);
    const isCucina =
      mail === "cng.nv.kitchen@gmail.com" ||
      userData.some((u) => u.role === "CUCINA" && u.mail === mail);
    const isUser =
      mail === "cng.srvlnc@gmail.com" ||
      userData.some((u) => u.role === "USER" && u.mail === mail);
    const isMngr =
      mail === "cng.nv.rstrnt.mngr13@gmail.com" ||
      userData.some((u) => u.role === "MNGR" && u.mail === mail);

    setAbility({
      isAdmin,
      isBar,
      isCucina,
      isObserver: !isAdmin && !isBar && !isCucina && !isUser && !isMngr,
      isUser,
      isMngr,
    });
  }, [data?.user?.email, isLoading, users]);

  const value = useMemo(
    () => ({
      ...ability,
      query: users || [],
    }),
    [ability]
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
