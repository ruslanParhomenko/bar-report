"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, differenceInMonths } from "date-fns";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAbility } from "@/providers/AbilityProvider";
import { deleteEmployee } from "@/app/actions/employees/employeeAction";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";
import { EmployeesSchemaTypeData } from "./schema";
import { toast } from "sonner";
import ActionButtonEmployee from "./ActionButtonEmployee";

export function GetEmployeesCard({ data }: { data: EmployeesContextValue[] }) {
  const t = useTranslations("Home");
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;

  const isMobile = useIsMobile();

  const form = useFormContext<EmployeesSchemaTypeData>();
  const handleDeleteUser = (id: string) =>
    isAdmin ? deleteEmployee(id) : toast.error("Access denied");
  const handleResetForm = () => form.reset();

  return (
    <div className="h-[98vh] flex md:flex-1 flex-col md:overflow-hidden">
      <Table className="md:table-fixed">
        <TableHeader className="sticky top-0 bg-background z-20">
          <TableRow className="text-gr h-12">
            <TableHead className="w-5" />
            <TableHead className="w-15">{t("date")}</TableHead>
            <TableHead className="sticky left-0 md:w-30">{t("name")}</TableHead>
            <TableHead className="w-15"></TableHead>
            <TableHead className="w-40">{t("mail")}</TableHead>
            <TableHead className="w-25 truncate">{t("tel")}</TableHead>
            <TableHead className="w-15 truncate">{t("vacation")}</TableHead>
            <TableHead className="w-15 truncate">
              {t("usedVacationDays")}
            </TableHead>
            <TableHead className="w-15 truncate">{t("remaining")}</TableHead>
            <TableHead className="w-18">{t("rate")}</TableHead>
            <TableHead className="text-center w-30" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {data
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((emp, idx) => {
              const monthsWorked = emp?.employmentDate
                ? differenceInMonths(new Date(), emp.employmentDate)
                : 0;
              const vacationDays = Math.round(monthsWorked * 2.33);
              const usedVacationDays =
                emp.vacationPay?.reduce(
                  (acc, r) => acc + Number(r.countDays),
                  0
                ) ?? 0;

              return (
                <TableRow
                  key={emp.id}
                  className={cn(
                    "hover:text-bl cursor-pointer h-10 [&>td]:py-1 [&>th]:py-1",
                    !emp.employmentDate && "text-rd font-bold"
                  )}
                >
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    {emp.employmentDate
                      ? format(emp.employmentDate, "dd.MM.yy")
                      : "-"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "sticky left-0",
                      isMobile ? "bg-card/60" : ""
                    )}
                  >
                    {emp.name}
                  </TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell className="truncate">{emp.mail}</TableCell>
                  <TableCell className="truncate">{emp?.tel || "-"}</TableCell>
                  <TableCell>{vacationDays}</TableCell>
                  <TableCell>{usedVacationDays}</TableCell>
                  <TableCell>{vacationDays - usedVacationDays}</TableCell>
                  <TableCell>{isDisabled ? "-" : Number(emp.rate)}</TableCell>
                  <TableCell>
                    <ActionButtonEmployee
                      handleDeleteUser={handleDeleteUser}
                      handleResetForm={handleResetForm}
                      id={emp.id}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
