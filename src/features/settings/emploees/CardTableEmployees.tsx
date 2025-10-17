"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Minus } from "lucide-react";
import { format, differenceInMonths } from "date-fns";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { EmployeesSchemaTypeData } from "@/features/settings/schema";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAbility } from "@/providers/AbilityProvider";
import { deleteEmployee } from "@/app/actions/employees/employeeAction";

export const EMPLOYEES_ROLE = ["barmen", "waiters", "cook", "mngr", "dish"];

export function EmployeesTable({ data }: { data: EmployeesSchemaTypeData[] }) {
  const { isAdmin, isMngr } = useAbility();
  const isDisabled = !isAdmin && !isMngr;
  const t = useTranslations("Home");
  const isMobile = useIsMobile();
  const form = useFormContext<EmployeesSchemaTypeData>();
  const [sortByName, setSortByName] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") || "all";

  const handleDeleteUser = (id: string) => deleteEmployee(id);

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete("role");
    else params.set("role", value);
    router.replace(`?${params.toString()}`);
  };

  const filteredData = useMemo(() => {
    if (roleFilter === "all") return data;
    return data?.filter((emp) => emp.role === roleFilter);
  }, [data, roleFilter]);

  const sortedData = useMemo(() => {
    if (!sortByName) return filteredData;
    return [...filteredData].sort((a, b) =>
      a.name.localeCompare(b.name, "ro", { sensitivity: "base" })
    );
  }, [filteredData, sortByName]);

  return (
    <Card className="shadow-md border rounded-2xl overflow-hidden py-4 px-2 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-lg font-semibold">{t("employeesList")}</h2>

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
                (acc, r) => acc + Number(r.countDays),
                0
              ) ?? 0;

            return (
              <TableRow
                key={emp.id}
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
                <TableCell>{isDisabled ? "-" : Number(emp.rate)}</TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <Button
                    className="cursor-pointer hover:bg-bl"
                    variant="secondary"
                    type="button"
                    size="sm"
                    onClick={() => form.reset(emp)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    className="cursor-pointer hover:bg-rd"
                    variant="secondary"
                    size={"sm"}
                    type="button"
                    onClick={() => handleDeleteUser(emp.id as string)}
                    disabled={isDisabled}
                  >
                    <Minus className="text-rd" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
