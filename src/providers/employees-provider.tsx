"use client";
import { Employee } from "@/features/settings/create-employee/model/type";
import { createContext, useContext, useMemo } from "react";

const EmployeesContext = createContext<Employee[] | null>(null);

export function EmployeesProvider({
  children,
  employees,
}: {
  children: React.ReactNode;
  employees: Employee[];
}) {
  const value = useMemo(() => employees, [employees]);
  return (
    <EmployeesContext.Provider value={value}>
      {children}
    </EmployeesContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeesContext);
  if (!ctx)
    throw new Error("useEmployees must be used inside EmployeesProvider");
  return ctx;
}
