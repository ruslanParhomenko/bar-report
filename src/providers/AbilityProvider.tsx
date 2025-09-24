"use client";

import { useGoogleData, User } from "@/hooks/useGoogleData";
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
  query: User[];
};

const AbilityContext = createContext<AbilityContextType | null>(null);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const { data } = useSession();

  const { users, isLoading } = useGoogleData();

  const [ability, setAbility] = useState({
    isAdmin: false,
    isBar: false,
    isCucina: false,
    isObserver: true,
    isUser: false,
  });

  useEffect(() => {
    if (isLoading) return;
    const email = data?.user?.email;
    const userData = users || [];

    if (!email) return;

    const isAdmin =
      email === "parhomenkogm@gmail.com" ||
      userData.some((u) => u.role === "ADMIN" && u.mail === email);
    const isBar =
      email === "cng.nv.rstrnt@gmail.com" ||
      userData.some((u) => u.role === "BAR" && u.mail === email);
    const isCucina =
      email === "cng.nv.kitchen@gmail.com" ||
      userData.some((u) => u.role === "CUCINA" && u.mail === email);
    const isUser =
      email === "cng.srvlnc@gmail.com" ||
      userData.some((u) => u.role === "USER" && u.mail === email);

    setAbility({
      isAdmin,
      isBar,
      isCucina,
      isObserver: !isAdmin && !isBar && !isCucina && !isUser,
      isUser,
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
