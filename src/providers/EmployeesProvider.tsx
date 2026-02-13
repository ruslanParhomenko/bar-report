"use client";

import { EmployeesSchemaTypeData } from "@/features/employees/employee/schema";
import { createContext, useContext } from "react";

export type EmployeesContextValue = EmployeesSchemaTypeData & {
  id: string;
};

const EmployeesContext = createContext<EmployeesContextValue[]>([]);

export function EmployeesProvider({
  employees,
  children,
}: {
  employees: EmployeesContextValue[];
  children: React.ReactNode;
}) {
  return (
    <EmployeesContext.Provider value={employees}>
      {children}
    </EmployeesContext.Provider>
  );
}

export const useEmployees = () => useContext(EmployeesContext);
