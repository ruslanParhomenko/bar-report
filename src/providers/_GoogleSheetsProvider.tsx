// "use client";

// import { useLocalStorageForm } from "@/hooks/use-local-storage";
// import { Employee, useGoogleData } from "@/hooks/useGoogleData";
// import { createContext, useContext, useEffect } from "react";

// interface EmployeesContextValue {
//   employees: Employee[];
//   isLoading: boolean;
// }

// const EmployeesContext = createContext<EmployeesContextValue | undefined>(
//   undefined
// );

// export function GoogleSheetsProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { employees, isLoading } = useGoogleData();
//   const { getValue, setValue } = useLocalStorageForm<Employee[]>("employees");

//   useEffect(() => {
//     if (employees) {
//       setValue(employees);
//     }
//   }, [employees, setValue]);

//   return (
//     <EmployeesContext.Provider
//       value={{
//         employees: employees || getValue() || [],
//         isLoading: isLoading,
//       }}
//     >
//       {children}
//     </EmployeesContext.Provider>
//   );
// }

// export function useEmployees() {
//   const ctx = useContext(EmployeesContext);
//   if (!ctx)
//     throw new Error("useEmployees must be used within EmployeesProvider");
//   return ctx;
// }
