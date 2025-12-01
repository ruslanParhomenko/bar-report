import { EmployeeVacationCard } from "./EmployeeVacationCard";
import { GetEmployeesCard } from "./GetEmployeesCard";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";

export function EmployeesPage({
  employees,
  isAdmin,
}: {
  employees: EmployeesContextValue[];
  isAdmin: boolean;
}) {
  return (
    <div className="flex">
      <GetEmployeesCard data={employees} isAdmin={isAdmin} />

      <EmployeeVacationCard />
    </div>
  );
}
