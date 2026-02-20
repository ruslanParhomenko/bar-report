"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { differenceInMonths } from "date-fns";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { EmployeesContextValue } from "@/providers/employees-provider";
import ActionButtonEmployee from "./employee-actions";
import { handleCopy } from "@/utils/handler-copy-text";
import { CheckCircle, UserX } from "lucide-react";
import { useAbility } from "@/providers/ability-provider";
import SelectEmployeeBy from "@/components/nav/select-employee";
import { useState } from "react";
import { formatShortDate } from "@/utils/format-date";

export function EmployeesTable({ data }: { data: EmployeesContextValue[] }) {
  const t = useTranslations("Home");

  const [role, setRole] = useState("waiters");

  const { isAdmin, isManager } = useAbility();

  const isViewer = isAdmin || isManager;

  return (
    <Table className="md:table-fixed">
      <TableHeader className="sticky top-0 bg-background z-20">
        <TableRow className="text-gr h-12">
          <TableHead className="w-5" />
          <TableHead className="w-15">{t("date")}</TableHead>
          <TableHead className="sticky left-0 md:w-25">{t("name")}</TableHead>
          <TableHead className="w-20">
            <SelectEmployeeBy role={role} setRole={setRole} />
          </TableHead>
          <TableHead className="w-30">{t("mail")}</TableHead>
          <TableHead className="w-20 truncate">{t("tel")}</TableHead>
          <TableHead className="w-12 truncate">{t("vacation")}</TableHead>
          <TableHead className="w-12 truncate">
            {t("usedVacationDays")}
          </TableHead>
          <TableHead className="w-12 truncate">{t("remaining")}</TableHead>
          <TableHead className="w-15">{t("rate")}</TableHead>
          <TableHead className="w-15">{t("status")}</TableHead>
          <TableHead className="text-center w-25" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {data
          ?.filter((emp) => role === "all" || emp.role === role)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((emp, idx) => {
            const monthsWorked = emp?.employmentDate
              ? differenceInMonths(new Date(), emp.employmentDate)
              : 0;
            const vacationDays = Math.round(monthsWorked * 2.33);
            const usedVacationDays =
              emp.vacationPay?.reduce(
                (acc, r) => acc + Number(r.countDays),
                0,
              ) ?? 0;

            return (
              <TableRow
                key={emp.id}
                className={cn(
                  "hover:text-bl cursor-pointer h-10 [&>td]:py-1 [&>th]:py-1",
                  !emp.employmentDate && "text-rd font-bold",
                )}
              >
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>
                  {emp.employmentDate
                    ? formatShortDate(emp.employmentDate)
                    : "-"}
                </TableCell>

                <TableCell
                  className={cn(
                    "sticky left-0 bg-background/70 z-10",
                    emp.status && emp.status === "fired"
                      ? "text-muted-foreground!"
                      : "",
                  )}
                  onClick={() => handleCopy(emp.name)}
                >
                  {emp.name}
                </TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell
                  className="truncate"
                  onClick={() => emp.mail && handleCopy(emp.mail)}
                >
                  {emp.mail}
                </TableCell>
                <TableCell
                  className="truncate"
                  onClick={() => emp?.tel && handleCopy(emp.tel)}
                >
                  {emp?.tel || "-"}
                </TableCell>
                <TableCell>{vacationDays}</TableCell>
                <TableCell>{usedVacationDays}</TableCell>
                <TableCell>{vacationDays - usedVacationDays}</TableCell>
                <TableCell>{isViewer ? Number(emp.rate) : "-"}</TableCell>
                <TableCell>
                  {emp.status && emp.status === "fired" ? (
                    <UserX className="w-4 h-4 text-rd" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-bl" />
                  )}
                </TableCell>
                <TableCell>
                  <ActionButtonEmployee id={emp.id} />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
