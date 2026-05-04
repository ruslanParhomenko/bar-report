import { ProtectedPage } from "@/components/wrapper/protected-page";
import { EMPLOYEES_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { EmployeesPage } from "@/features/employees/employees-page";

export default function Page() {
  return (
    <ProtectedPage route={EMPLOYEES_MAIN_ROUTE}>
      <EmployeesPage />
    </ProtectedPage>
  );
}
