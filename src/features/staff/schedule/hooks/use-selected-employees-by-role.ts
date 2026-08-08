import { useEmployees } from "@/providers/employees-provider";
import { EMPLOYEE_ROLES_BY_DEPARTMENT } from "../model/constants";

// selectedEmployeesByRole
export function useSelectedEmployeesByRole(
  patch: keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT,
) {
  const employees = useEmployees().filter((e) => e.status === "active");
  const allowedRoles: readonly string[] =
    EMPLOYEE_ROLES_BY_DEPARTMENT[patch] ?? [];

  return employees
    .filter((e) => allowedRoles.includes(e.role))
    .sort((a, b) => {
      const roleA = allowedRoles.indexOf(a.role);
      const roleB = allowedRoles.indexOf(b.role);
      if (roleA !== roleB) return roleA - roleB;
      return a.name.localeCompare(b.name);
    });
}