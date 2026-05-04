"use client";

import { useHashParam } from "@/hooks/use-hash";
import { useAbility } from "@/providers/ability-provider";
import { useEmployees } from "@/providers/employees-provider";

import EmployeeCreatePage from "./employee/create/employee-create-page";
import { EmployeesTable } from "./employee/data/employees-table";
import { VacationTable } from "./employee/data/vacation-table";
import UsersCreatePage from "./users/create/users-create-page";
import UsersTable from "./users/data/users-table";

export function EmployeesPage() {
  const [value] = useHashParam("tab");
  const tab = value || "employees";
  const employees = useEmployees();
  const { users } = useAbility();

  return (
    <>
      {tab === "employees" && <EmployeesTable data={employees} />}
      {tab === "vacation" && <VacationTable />}
      {tab === "create-employees" && <EmployeeCreatePage />}
      {tab === "users" && <UsersTable users={users} />}
      {tab === "create-user" && <UsersCreatePage />}
    </>
  );
}
