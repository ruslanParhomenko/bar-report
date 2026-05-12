"use client";
import {
  CREATE_EMPLOYEE_MAIN_ROUTE,
  CREATE_USER_MAIN_ROUTE,
  PENALTY_UPDATE_MAIN_ROUTE,
} from "@/constants/route-tag";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type EditContextType = {
  isEdit: boolean;
  setIsEdit: (v: boolean) => void;
  resetFn: (() => void) | null;
  registerReset: (fn: () => void) => void;
};

const EDIT_PATHS = new Set([
  CREATE_EMPLOYEE_MAIN_ROUTE,
  CREATE_USER_MAIN_ROUTE,
  PENALTY_UPDATE_MAIN_ROUTE,
]);
const EditContext = createContext<EditContextType | null>(null);
export default function EditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1] || "";
  const [isEdit, setIsEdit] = useState(false);
  const [resetFn, setResetFn] = useState<(() => void) | null>(null);

  const registerReset = (fn: () => void) => {
    setResetFn(() => fn);
  };

  useEffect(() => {
    if (EDIT_PATHS.has(mainRoute)) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
    setResetFn(null);
  }, [pathname]);
  return (
    <EditContext.Provider value={{ isEdit, setIsEdit, resetFn, registerReset }}>
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error("useEdit must be used inside EditProvider");
  return ctx;
}
