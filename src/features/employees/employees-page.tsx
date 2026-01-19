import { EmployeeVacationData } from "./employee-vacation-data";
import { EmployeesData } from "./employees-data";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";

export function EmployeesPage({
  employees,
}: {
  employees: EmployeesContextValue[];
}) {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <EmployeesData data={employees} />

      <EmployeeVacationData />
    </div>
  );
}
