import { Employee } from "@/features/settings/create-employee/model/type";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "../model/constants";

export function useSelectedEmployeesByRole(
  patch: keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT,
  employees: Employee[],
) {
  const activeEmployees = employees.filter((e) => e.status === "active");
  const allowedRoles: readonly string[] =
    EMPLOYEE_ROLES_BY_DEPARTMENT[patch] ?? [];

  return activeEmployees
    .filter((e) => allowedRoles.includes(e.role))
    .sort((a, b) => {
      const roleA = allowedRoles.indexOf(a.role);
      const roleB = allowedRoles.indexOf(b.role);
      if (roleA !== roleB) return roleA - roleB;
      return a.name.localeCompare(b.name);
    });
}
