"use client";
import { createContext, useContext } from "react";

const EmployeesContext = createContext<any[]>([]);

export function EmployeesProvider({
  employees,
  children,
}: {
  employees: any[];
  children: React.ReactNode;
}) {
  return (
    <EmployeesContext.Provider value={employees}>
      {children}
    </EmployeesContext.Provider>
  );
}

export const useEmployees = () => useContext(EmployeesContext);
