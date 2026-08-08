import { RowEmployeesTipsType } from "./schema";

type EmployeeTipTotal = {
  id: string;
  role: string;
  employee: string;
  total: number;
};
type TipsSummary = {
  perEmployee: EmployeeTipTotal[];
  totalAll: number;
};

export function calculateTipsTotal(
  employees: RowEmployeesTipsType[],
): TipsSummary {
  const perEmployee: EmployeeTipTotal[] = employees.map((e) => {
    const total = e.tipsByDay
      .map((t) => Number(t) || 0)
      .reduce((sum, t) => sum + t, 0);
    return {
      id: e.id,
      role: e.role,
      employee: e.employee,
      total,
    };
  });

  const totalAll = perEmployee.reduce((sum, e) => sum + e.total, 0);

  return { perEmployee, totalAll };
}
