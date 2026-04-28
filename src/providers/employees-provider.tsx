"use client";
import { Employee } from "@/app/actions/employees/employee-action";
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
