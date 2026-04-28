"use client";

import { useHashParam } from "@/hooks/use-hash";
import { useAbility } from "@/providers/ability-provider";
import { useEmployees } from "@/providers/employees-provider";
import { Activity } from "react";

import EmployeePage from "./employee/employee-page";
import { EmployeesTable } from "./employee/employees-table";
import { VacationTable } from "./employee/vacation-table";
import UsersForm from "./users/users-form";
import UsersTable from "./users/users-table";

export function EmployeesPage() {
  const [value] = useHashParam("tab");

  const tab = value || "employees";
  const employees = useEmployees();
  const { users } = useAbility();

  return (
    <>
      <Activity mode={tab === "employees" ? "visible" : "hidden"}>
        <EmployeesTable data={employees} />
      </Activity>
      <Activity mode={tab === "vacation" ? "visible" : "hidden"}>
        <VacationTable />
      </Activity>
      <Activity mode={tab === "create-employee" ? "visible" : "hidden"}>
        <EmployeePage />
      </Activity>
      <Activity mode={tab === "users" ? "visible" : "hidden"}>
        <UsersTable users={users} />
      </Activity>
      <Activity mode={tab === "create-user" ? "visible" : "hidden"}>
        <UsersForm />
      </Activity>
    </>
  );
}
