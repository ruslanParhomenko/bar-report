import { EmployeeVacationCard } from "./EmployeeVacationCard";
import { GetEmployeesCard } from "./GetEmployeesCard";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";

export function EmployeesPage({
  employees,
}: {
  employees: EmployeesContextValue[];
}) {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <GetEmployeesCard data={employees} />

      <EmployeeVacationCard />
    </div>
  );
}
