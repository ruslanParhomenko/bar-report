import { GetEmployeesCard } from "./GetEmployeesCard";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";

export function EmployeesPage({
  employees,
}: {
  employees: EmployeesContextValue[];
}) {
  return (
    <GetEmployeesCard data={employees} />

    // <EmployeeVacationCard />
  );
}
