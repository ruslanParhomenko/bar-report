import EmployeeCreatePage from "./employee/create/employee-create-page";
import { EmployeesTable } from "./employee/data/employees-table";
import { VacationTable } from "./employee/data/vacation-table";
import UsersCreatePage from "./users/create/users-create-page";
import UsersTable from "./users/data/users-table";

export function EmployeesPage({
  isAdmin,
  tab,
  filter,
}: {
  isAdmin: boolean;
  tab: string;
  filter: string;
}) {
  return (
    <>
      {tab === "employees" && (
        <EmployeesTable isAdmin={isAdmin} filter={filter} />
      )}
      {tab === "vacation" && <VacationTable />}
      {tab === "create-employees" && <EmployeeCreatePage />}
      {tab === "users" && <UsersTable isAdmin={isAdmin} />}
      {tab === "create-user" && <UsersCreatePage />}
    </>
  );
}
