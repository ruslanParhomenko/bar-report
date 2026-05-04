"use client";
import SelectOptions from "@/components/select/select-options";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/providers/employees-provider";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { EMPLOYEES_ROLE } from "../create/constants";

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
      <div className="mx-4 my-6 flex gap-8">
        <SelectOptions
          options={EMPLOYEES_ROLE}
          value={role}
          onChange={setRole}
          className="text-bl! border-bl h-6! w-42 border"
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
            className="text-bl! border-bl h-6! w-42 border"
            placeHolder="employee"
          />
        )}
        <button
          onClick={handleReset}
          className="cursor-pointer rounded-full"
          title="Reset"
        >
          <RefreshCw className="text-bl h-4 w-4 font-bold" />
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
