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
import { useEmployees } from "@/providers/GoogleSheetsProvider";
import { format, parseISO } from "date-fns";
import { useSidebar } from "@/components/ui/sidebar";

type DateFilter = "all" | "registered" | "nonregistered";
type PositionFilter = "all" | "barmen" | "waiters" | "cook" | "admin";

export function EmployeesListTable() {
  const { isAdmin } = useAbility();
  const { isMobile } = useSidebar();
  const { employees } = useEmployees();

  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");

  const filteredEmployees = employees.filter((emp) => {
    if (dateFilter === "registered" && !emp.date) return false;
    if (dateFilter === "nonregistered" && emp.date) return false;
    if (positionFilter !== "all" && emp.position !== positionFilter)
      return false;

    return true;
  });

  return (
    <Table className="table-fixed w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-15">
            <Select
              value={dateFilter}
              onValueChange={(val: DateFilter) => setDateFilter(val)}
            >
              <SelectTrigger className="w-full border-0">
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all</SelectItem>
                <SelectItem value="registered">registered</SelectItem>
                <SelectItem value="nonregistered">not Registered</SelectItem>
              </SelectContent>
            </Select>
          </TableHead>
          <TableHead className="w-30 truncate">
            <Select
              value={positionFilter}
              onValueChange={(val: PositionFilter) => setPositionFilter(val)}
            >
              <SelectTrigger className="w-full border-0">
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
          </TableHead>
          <TableHead className="truncate w-8 text-center">position</TableHead>
          <TableHead className="truncate w-8 text-center">vacation</TableHead>
          <TableHead className="w-10 text-center">rate</TableHead>
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
                className={`truncate ${!emp.date ? "text-rd font-bold" : ""}`}
              >
                {emp.name}
              </TableCell>
              <TableCell className="text-muted-foreground text-center">
                {isMobile ? emp.position.slice(0, 1) : emp.position}
              </TableCell>
              <TableCell className="text-center">
                {emp.date ? emp.vacation : "-"}
              </TableCell>
              <TableCell className="text-muted-foreground text-center">
                {isAdmin ? emp.rate : "-"}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
