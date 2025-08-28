"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Employee } from "@/generated/prisma";
import { useApi } from "@/hooks/use-query";
import { useAbility } from "@/providers/AbilityProvider";
import { useEmployees } from "@/providers/EmployeeProvider";
import { Delete } from "lucide-react";
import { useTranslations } from "next-intl";

export function EmployeesListTable() {
  const t = useTranslations("Home");
  const { isAdmin } = useAbility();
  const { employees, delete: deleteMutation } = useEmployees();

  const deleteEmployee = (id: number) => {
    if (!isAdmin) return;
    deleteMutation(id);
  };

  return (
    <div className="w-full px-2 ">
      <h2 className="text-lg font-semibold mt-6">{t("employees")}:</h2>
      {employees.map((emp, idx) => (
        <div key={`${emp.id}-${idx}`} className="flex justify-between py-2">
          <Label className="min-w-1/3">{emp.name}</Label>
          <Label className="text-muted-foreground ">{emp.position}</Label>
          <Label className="text-muted-foreground ">
            {isAdmin ? `${emp.rate}` : "-"}
          </Label>
          <Button type="button" onClick={() => deleteEmployee(emp.id)}>
            <Delete />
          </Button>
        </div>
      ))}
    </div>
  );
}
