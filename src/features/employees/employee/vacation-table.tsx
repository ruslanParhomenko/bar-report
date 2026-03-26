"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/providers/employees-provider";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import SelectOptions from "@/components/select/select-options";
import { EMPLOYEES_ROLE } from "./constants";

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
      <div className="flex gap-8 my-6 mx-4">
        <SelectOptions
          options={EMPLOYEES_ROLE}
          value={role}
          onChange={setRole}
          className="w-42 border h-6! text-bl! border-bl"
          placeHolder="role"
        />
        {role && (
          <SelectOptions
            options={employees
              .filter((e) => e.role === role)
              .map((emp) => {
                return {
                  value: emp.id,
                  label: emp.name,
                };
              })}
            value={employeeId}
            onChange={setEmployeeId}
            className="w-42 border h-6! text-bl! border-bl"
            placeHolder="employee"
          />
        )}
        <button
          onClick={handleReset}
          className="cursor-pointer rounded-full"
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
