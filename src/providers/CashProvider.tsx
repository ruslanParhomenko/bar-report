"use client";

import { CashFormType } from "@/features/cash/schema";
import { supabase } from "@/lib/supabaseClient";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export type CashContextType = {
  form_data: CashFormType;
  unique_id: string;
};

const CashContext = createContext<CashContextType[]>([]);

export const CashProvider = ({
  data,
  children,
}: {
  data: CashContextType[];
  children: React.ReactNode;
}) => {
  const [cash, setCash] = useState<CashContextType[]>(data || []);

  useEffect(() => {
    if (data) setCash(data);
  }, [data]);

  useEffect(() => {
    const channel = supabase
      .channel("cash-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cash" },
        (payload: any) => {
          const newItem: CashContextType = {
            form_data: payload.new.form_data,
            unique_id: payload.new.unique_id,
          };

          setCash((prev) => {
            if (payload.eventType === "INSERT") {
              return [newItem, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              toast.warning("Другой пользователь добавил изменения!");
              return prev.map((item) =>
                item.unique_id === newItem.unique_id ? newItem : item
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter(
                (item) => item.unique_id !== payload.old.unique_id
              );
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return <CashContext.Provider value={cash}>{children}</CashContext.Provider>;
};

export const useCash = () => useContext(CashContext);
