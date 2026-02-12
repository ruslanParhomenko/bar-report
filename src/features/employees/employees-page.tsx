"use client";
import { useSearchParams } from "next/navigation";
import { EmployeeVacationData } from "./employee-vacation-data";
import { EmployeesData } from "./employees-data";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";
import { Activity } from "react";
import { EmployeeForm } from "./employee-form";
import UsersPage from "../users/users-page";
import { UserData } from "@/app/actions/users/userAction";
import UsersForm from "../users/users-form";

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
        <EmployeesData data={employees} />
      </Activity>
      <Activity mode={tab === "vacation" ? "visible" : "hidden"}>
        <EmployeeVacationData />
      </Activity>
      <Activity mode={tab === "create-employee" ? "visible" : "hidden"}>
        <EmployeeForm employee={null} />
      </Activity>
      <Activity mode={tab === "users" ? "visible" : "hidden"}>
        <UsersPage users={users} />
      </Activity>
      <Activity mode={tab === "create-user" ? "visible" : "hidden"}>
        <UsersForm users={null} />
      </Activity>
    </>
  );
}
