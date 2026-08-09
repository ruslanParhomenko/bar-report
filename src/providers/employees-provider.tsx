"use client";
import { Employee } from "@/features/settings/create-employee/model/type";
import { createContext, useContext } from "react";

const EmployeesContext = createContext<Employee[]>([]);

export function EmployeesProvider({
  employees,
  children,
}: {
  employees: Employee[];
  children: React.ReactNode;
}) {
  return (
    <EmployeesContext.Provider value={employees}>
      {children}
    </EmployeesContext.Provider>
  );
}

export const useEmployees = () => useContext(EmployeesContext);
