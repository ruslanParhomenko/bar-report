"use client";
import { Employee } from "@/app/actions/employees/employee-action";
import SelectOptions from "@/components/select/select-options";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useAbility } from "@/providers/ability-provider";
import { formatShortDate } from "@/utils/format-date";
import { handleCopy } from "@/utils/handler-copy-text";
import { differenceInMonths } from "date-fns";
import { CheckCircle, UserX, XCircle } from "lucide-react";
import { useState } from "react";
import { EMPLOYEES_ROLE } from "./constants";
import ActionButtonEmployee from "./employee-actions";

export function EmployeesTable({ data }: { data: Employee[] }) {
  const [role, setRole] = useState("waiters");

  const { isAdmin, isManager } = useAbility();

  const isViewer = isAdmin || isManager;

  return (
    <Table className="md:table-fixed [&>tbody>tr]:text-xs">
      <TableHeader className="bg-background sticky top-0 z-20 md:bg-transparent">
        <TableRow className="text-gr">
          <TableHead className="w-5" />
          <TableHead className="w-15" />
          <TableHead className="sticky left-0 md:w-25" />
          <TableHead className="w-15" />
          <TableHead className="w-20">
            <SelectOptions
              options={EMPLOYEES_ROLE}
              value={role}
              onChange={setRole}
              placeHolder="role"
              className="text-bl bg-transparent!"
            />
          </TableHead>
          <TableHead className="w-30" />
          <TableHead className="w-20 truncate" />
          <TableHead className="w-12 truncate" />
          <TableHead className="w-12 truncate" />
          <TableHead className="w-12 truncate">...</TableHead>

          <TableHead className="w-15">status</TableHead>
          <TableHead className="w-15 truncate print:w-5">form</TableHead>
          <TableHead className="w-15 truncate">key</TableHead>
          <TableHead className="w-25 text-center" />
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
                  "hover:text-bl cursor-pointer",
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
                    "bg-background sticky left-0 z-10 md:bg-transparent print:w-30 print:bg-transparent",
                    emp.status && emp.status === "fired"
                      ? "text-muted-foreground!"
                      : "",
                  )}
                  onClick={() => handleCopy(emp.name)}
                >
                  {emp.name}
                </TableCell>
                <TableCell>{isViewer ? Number(emp.rate) : "-"}</TableCell>
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

                <TableCell>
                  {emp.status && emp.status === "fired" ? (
                    <UserX size={14} className="text-rd" />
                  ) : (
                    <CheckCircle size={14} className="text-bl" />
                  )}
                </TableCell>
                <TableCell className="print:w-10">
                  {emp.employeesWorkForm ? (
                    <CheckCircle size={14} className="text-bl" />
                  ) : (
                    <XCircle size={14} className="text-rd" />
                  )}
                </TableCell>
                <TableCell className="print:w-10">
                  {emp.employeesKey ? (
                    <CheckCircle size={14} className="text-bl" />
                  ) : (
                    <XCircle size={14} className="text-rd" />
                  )}
                </TableCell>
                <TableCell className="print:hidden">
                  <ActionButtonEmployee id={emp.id} />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
