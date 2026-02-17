"use client";

import { UserData } from "@/app/actions/users/user-action";
import { EmployeesContextValue } from "@/providers/employees-provider";
import { useSearchParams } from "next/navigation";
import { Activity } from "react";
import { EmployeesTable } from "./employee/employees-table";
import { VacationTable } from "./employee/vacation-table";
import { EmployeeForm } from "./employee/employee-form";
import UsersForm from "./users/users-form";
import UsersTable from "./users/users-table";

export function EmployeesPage({
  employees,
  users,
}: {
  employees: EmployeesContextValue[];
  users: UserData[];
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as string;
  return (
    <>
      <Activity mode={tab === "employees" ? "visible" : "hidden"}>
        <EmployeesTable data={employees} />
      </Activity>
      <Activity mode={tab === "vacation" ? "visible" : "hidden"}>
        <VacationTable />
      </Activity>
      <Activity mode={tab === "create-employee" ? "visible" : "hidden"}>
        <EmployeeForm employee={null} />
      </Activity>
      <Activity mode={tab === "users" ? "visible" : "hidden"}>
        <UsersTable users={users} />
      </Activity>
      <Activity mode={tab === "create-user" ? "visible" : "hidden"}>
        <UsersForm users={null} />
      </Activity>
    </>
  );
}
