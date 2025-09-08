"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAbility } from "@/providers/AbilityProvider";
import { useEmployees } from "@/providers/EmployeeProvider";
import { format, parseISO } from "date-fns";

type DateFilter = "all" | "registered" | "nonregistered";
type PositionFilter = "all" | "barmen" | "waiters" | "cook" | "admin";

export function EmployeesListTable() {
  const { isAdmin } = useAbility();
  const { employees } = useEmployees();

  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");

  const filteredEmployees = employees.filter((emp) => {
    // фильтр по дате
    if (dateFilter === "registered" && !emp.date) return false;
    if (dateFilter === "nonregistered" && emp.date) return false;

    // фильтр по должности
    if (positionFilter !== "all" && emp.position !== positionFilter)
      return false;

    return true;
  });

  return (
    <div className="w-full p-2 flex flex-col items-center space-y-4">
      {/* Фильтры */}
      <div className="flex gap-4 flex-col md:flex-row md:justify-between md:w-1/2">
        <div className="">
          <Select
            value={dateFilter}
            onValueChange={(val: DateFilter) => setDateFilter(val)}
          >
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Filter by Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="registered">registered</SelectItem>
              <SelectItem value="nonregistered">not Registered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={positionFilter}
            onValueChange={(val: PositionFilter) => setPositionFilter(val)}
          >
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Filter by Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="barmen">barmen</SelectItem>
              <SelectItem value="waiters">waiters</SelectItem>
              <SelectItem value="cook">cook</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Таблица */}
      <div className="w-full md:w-1/2">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-15">date</TableHead>
              <TableHead className="w-25 truncate">name</TableHead>
              <TableHead className="truncate w-12">position</TableHead>
              <TableHead className="truncate w-8">vacation</TableHead>
              <TableHead className="w-10">rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((emp, idx) => (
                <TableRow key={`${emp.date}-${idx}`}>
                  <TableCell>
                    {emp.date ? format(parseISO(emp.date), "dd.MM.yy") : "-"}
                  </TableCell>
                  <TableCell
                    className={`truncate ${
                      !emp.date ? "text-rd font-bold" : ""
                    }`}
                  >
                    {emp.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {emp.position}
                  </TableCell>
                  <TableCell>{emp.date ? emp.vacation : "-"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {isAdmin ? emp.rate : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
