"use client";

import SelectEmployeeBy from "@/components/nav/select-employee";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEmployees } from "@/providers/employees-provider";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

export function VacationTable() {
  const employees = useEmployees();

  const [role, setRole] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const handleReset = () => {
    setRole("");
    setEmployeeId("");
  };

  useEffect(() => {
    setEmployeeId("");
  }, [role]);

  const selectedEmployee = employees
    .filter((e) => e.role === role)
    .find((e) => e.id === employeeId);

  return (
    <>
      <div className="flex gap-8 my-2 mx-4">
        <SelectEmployeeBy role={role} setRole={setRole} className="h-9!" />
        {role && (
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger className="cursor-pointer  h-9! px-2  text-bl md:text-md text-xs [&>svg]:hidden justify-start border-0 shadow-none">
              <SelectValue placeholder="employee" />
            </SelectTrigger>

            <SelectContent>
              {employees
                .filter((e) => e.role === role)
                .map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
        <button
          onClick={handleReset}
          className="p-2  cursor-pointer rounded-full"
          title="Reset"
        >
          <RefreshCw className="w-4 h-4 text-bl font-bold" />
        </button>
      </div>

      {selectedEmployee && (
        <Table className="mt-6">
          <TableBody>
            {selectedEmployee.vacationPay?.map((item, idx) => {
              if (!item.startDate || !item.endDate) return null;

              const startDate = new Date(item.startDate);
              const endDate = new Date(item.endDate);

              return (
                <TableRow key={idx}>
                  <TableCell>{startDate.toDateString()}</TableCell>
                  <TableCell> - </TableCell>
                  <TableCell>{endDate.toDateString()}</TableCell>
                  <TableCell> = </TableCell>
                  <TableCell className="text-end">{item.countDays}</TableCell>
                </TableRow>
              );
            })}

            <TableRow>
              <TableCell colSpan={4} className="text-end font-semibold">
                Total:
              </TableCell>
              <TableCell className="text-end font-semibold">
                {selectedEmployee.vacationPay?.reduce(
                  (acc, item) => acc + Number(item.countDays || 0),
                  0,
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </>
  );
}
