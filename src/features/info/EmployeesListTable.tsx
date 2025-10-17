"use client";

import React, { useMemo, useState } from "react";
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

import { differenceInMonths, format } from "date-fns";
import { useSidebar } from "@/components/ui/sidebar";
import { useEmployees } from "@/providers/EmployeesProvider";
import { Switch } from "@/components/ui/switch";
import { EMPLOYEES_ROLE } from "../settings/constants";
import { Card } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { VacationPaySchemaType } from "../settings/schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function EmployeesListTable() {
  const { isAdmin, isMngr } = useAbility();

  const isDisabled = !isAdmin && !isMngr;
  const { isMobile } = useSidebar();
  const employees = useEmployees();
  const t = useTranslations("Home");

  const [sortByName, setSortByName] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") || "all";

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete("role");
    else params.set("role", value);
    router.replace(`?${params.toString()}`);
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredData = useMemo(() => {
    if (roleFilter === "all") return employees;
    return employees?.filter((emp) => emp.role === roleFilter);
  }, [employees, roleFilter]);

  const sortedData = useMemo(() => {
    if (!sortByName) return filteredData;
    return [...filteredData].sort((a, b) =>
      a.name.localeCompare(b.name, "ro", { sensitivity: "base" })
    );
  }, [filteredData, sortByName]);

  return (
    <Card className="shadow-md border rounded-2xl overflow-hidden md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground px-3">
            {t("filterByRole")}:
          </span>
          <Select value={roleFilter} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[150px] border-0">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {EMPLOYEES_ROLE.map((role) => (
                <SelectItem key={role} value={role}>
                  {t(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="text-gr">
            <TableHead>#</TableHead>
            <TableHead>{t("employmentDate")}</TableHead>
            <TableHead className="flex items-center gap-6 sticky left-0">
              {t("name")}
              <Switch
                checked={sortByName}
                onCheckedChange={setSortByName}
                aria-label="Sort by name"
              />
            </TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead>{t("vacationDays")}</TableHead>
            <TableHead>{t("usedVacationDays")}</TableHead>
            <TableHead>{t("remainingVacationDays")}</TableHead>
            <TableHead>{t("rate")}</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData?.map((emp, idx) => {
            const monthsWorked = emp?.employmentDate
              ? differenceInMonths(new Date(), emp.employmentDate)
              : 0;

            const vacationDays = Math.round(monthsWorked * 2.33);
            const usedVacationDays =
              emp.vacationPay?.reduce(
                (acc: number, r: VacationPaySchemaType) =>
                  acc + Number(r.countDays),
                0
              ) ?? 0;

            const remainingVacationDays = vacationDays - usedVacationDays;
            const isExpanded = expandedRows.includes(emp.id);

            return (
              <React.Fragment key={emp.id}>
                <TableRow
                  className={cn(
                    "hover:text-bl cursor-pointer",
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
                      isMobile ? "bg-background/90" : ""
                    )}
                  >
                    {emp.name}
                  </TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>{vacationDays}</TableCell>
                  <TableCell>{usedVacationDays}</TableCell>
                  <TableCell>{remainingVacationDays}</TableCell>
                  <TableCell>{isDisabled ? "-" : Number(emp.rate)}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-sm cursor-pointer"
                      onClick={() => toggleRow(emp.id)}
                    >
                      {isExpanded ? t("hide") : t("details")}
                    </Button>
                  </TableCell>
                </TableRow>

                {isExpanded && emp.vacationPay?.length > 0 && (
                  <TableRow className="border-0">
                    <TableCell colSpan={8}>
                      <div className="flex flex-col gap-2 px-10 text-bl">
                        {emp.vacationPay.map(
                          (v: VacationPaySchemaType, i: number) => {
                            if (v.countDays === "0")
                              return (
                                <Label className="text-rd" key={i}>
                                  отпусктных дней не использовано
                                </Label>
                              );
                            const start = v.startDate && new Date(v.startDate);
                            const end = new Date(v.endDate || "");
                            return (
                              <div
                                key={i}
                                className="grid grid-cols-[15%_15%_15%]"
                              >
                                <Label>
                                  {start && start.getFullYear()} __
                                  {start ? format(start, "MMMM") : "-"}
                                </Label>

                                <Label>
                                  {start && start.getDate()} →
                                  {end && end.getDate()}
                                </Label>
                                <Label>
                                  {t("days")} = {v.countDays}
                                </Label>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
