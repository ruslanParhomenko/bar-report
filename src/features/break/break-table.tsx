import { Table } from "@/components/ui/table";
import BreakTableHeader from "./break-header";
import BreakTableBody from "./break-body";
import { useEmployees } from "@/providers/EmployeesProvider";

const BAR_EMPLOYEES = ["waiters", "barmen"];

export default function BreakTable() {
  const employeesName = useEmployees()
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .map((e) => e.name);
  return (
    <Table className="md:table-fixed mt-6">
      <BreakTableHeader />
      <BreakTableBody employeesName={employeesName} />
    </Table>
  );
}
