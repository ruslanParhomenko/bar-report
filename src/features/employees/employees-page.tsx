"use client";

import { useEmployees } from "@/providers/employees-provider";
import { useSearchParams } from "next/navigation";
import { Activity } from "react";
import { EmployeesTable } from "./employee/employees-table";
import { VacationTable } from "./employee/vacation-table";
import { EmployeeForm } from "./employee/employee-form";
import UsersForm from "./users/users-form";
import UsersTable from "./users/users-table";
import { useAbility } from "@/providers/ability-provider";

export function EmployeesPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as string;
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
        <EmployeeForm />
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
