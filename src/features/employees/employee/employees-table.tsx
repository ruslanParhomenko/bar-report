"use client";
import PrintButton from "@/components/buttons/print-button";
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
import { EmployeesContextValue } from "@/providers/employees-provider";
import { formatShortDate } from "@/utils/format-date";
import { handleCopy } from "@/utils/handler-copy-text";
import { differenceInMonths } from "date-fns";
import { CheckCircle, FolderPlus, UserX, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { EMPLOYEES_ROLE } from "./constants";
import ActionButtonEmployee from "./employee-actions";

export function EmployeesTable({ data }: { data: EmployeesContextValue[] }) {
  const router = useRouter();

  const [role, setRole] = useState("waiters");

  const { isAdmin, isManager } = useAbility();
  const componentRef = useRef<HTMLDivElement>(null);

  const isViewer = isAdmin || isManager;

  return (
    <div ref={componentRef}>
      <Table className="md:table-fixed">
        <TableHeader className="bg-background sticky top-0 z-20">
          <TableRow className="text-gr h-10">
            <TableHead className="w-5" />
            <TableHead className="w-15" />
            <TableHead className="sticky left-0 md:w-25" />
            <TableHead className="w-15">rate</TableHead>
            <TableHead className="w-20">
              <SelectOptions
                options={EMPLOYEES_ROLE}
                value={role}
                onChange={setRole}
                placeHolder="role"
                className="text-bl bg-transparent!"
              />
            </TableHead>
            <TableHead className="w-30">mail</TableHead>
            <TableHead className="w-20 truncate">tel</TableHead>
            <TableHead className="w-12 truncate">vacation</TableHead>
            <TableHead className="w-12 truncate">used</TableHead>
            <TableHead className="w-12 truncate">remaining</TableHead>

            <TableHead className="w-15">status</TableHead>
            <TableHead className="w-15 truncate print:w-5">form</TableHead>
            <TableHead className="w-15 truncate">key</TableHead>
            <TableHead className="w-25 text-center">
              <div className="flex justify-center gap-6">
                <PrintButton componentRef={componentRef} className="" />
                <button
                  type={"button"}
                  onClick={() => router.push("/create-employees")}
                  className="cursor-pointer"
                >
                  <FolderPlus className="text-bl h-5 w-5" />
                </button>
              </div>
            </TableHead>
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
                    "hover:text-bl h-10 cursor-pointer [&>td]:py-1 [&>th]:py-1",
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
                      "bg-background sticky left-0 z-10 print:w-30 print:bg-transparent",
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
                      <UserX className="text-rd h-4 w-4" />
                    ) : (
                      <CheckCircle className="text-bl h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="print:w-10">
                    {emp.employeesWorkForm ? (
                      <CheckCircle className="text-bl h-4 w-4" />
                    ) : (
                      <XCircle className="text-rd h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="print:w-10">
                    {emp.employeesKey ? (
                      <CheckCircle className="text-bl h-4 w-4" />
                    ) : (
                      <XCircle className="text-rd h-4 w-4" />
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
    </div>
  );
}
