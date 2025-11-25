"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pencil,
  Minus,
  TreePalmIcon,
  CircleMinus,
  CirclePlus,
} from "lucide-react";
import { format, differenceInMonths } from "date-fns";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAbility } from "@/providers/AbilityProvider";
import { deleteEmployee } from "@/app/actions/employees/employeeAction";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";
import { EMPLOYEES_ROLE, EmployeesSchemaTypeData } from "./schema";
import { toast } from "sonner";

export function GetEmployeesCard({
  data,
  isOpen,
  setIsOpen,
}: {
  data: EmployeesContextValue[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations("Home");
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") || "waiters";

  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;

  const isMobile = useIsMobile();

  const form = useFormContext<EmployeesSchemaTypeData>();
  const handleDeleteUser = (id: string) =>
    isAdmin ? deleteEmployee(id) : toast.error("Access denied");

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("role", value);
    router.replace(`?${params.toString()}`);
  };

  const filteredData = useMemo(() => {
    if (roleFilter === "all") return data;
    return data?.filter((emp) => emp.role === roleFilter);
  }, [data, roleFilter]);

  return (
    <div className="h-[98vh] flex md:flex-1 flex-col md:overflow-hidden">
      <Table className="md:table-fixed">
        <TableHeader className="sticky top-0 bg-background z-20">
          <TableRow className="text-gr h-12">
            <TableHead className="w-5">#</TableHead>
            <TableHead className="w-15">{t("date")}</TableHead>
            <TableHead
              className="sticky left-0 md:w-30"
              onClick={() => setIsOpen((v) => !v)}
            >
              <div className="flex justify-between items-center cursor-pointer">
                {t("name")}

                {isOpen ? (
                  <CircleMinus className="mr-4 w-4 h-4 text-rd" />
                ) : (
                  <CirclePlus className="mr-4 w-4 h-4 text-bl" />
                )}
              </div>
            </TableHead>
            <TableHead className="w-15">
              <Select value={roleFilter} onValueChange={handleRoleChange}>
                <SelectTrigger className="border-0 shadow-none p-0! cursor-pointer bg-transparent!">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all")}</SelectItem>
                  {EMPLOYEES_ROLE.map((role, idx) => (
                    <SelectItem key={`${role.value}-${idx}`} value={role.value}>
                      {t(role.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableHead>
            <TableHead className="w-40">{t("mail")}</TableHead>
            <TableHead className="w-25 truncate">{t("tel")}</TableHead>
            <TableHead className="w-15 truncate">{t("vacationDays")}</TableHead>
            <TableHead className="w-15 truncate">
              {t("usedVacationDays")}
            </TableHead>
            <TableHead className="w-18">{t("rate")}</TableHead>
            <TableHead className="text-center w-30">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((emp, idx) => {
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
                    "hover:text-bl cursor-pointer h-10 [&>td]:py-1 [&>th]:py-1",
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
                      isMobile ? "bg-card/60" : ""
                    )}
                  >
                    {emp.name}
                  </TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell className="truncate">{emp.mail}</TableCell>
                  <TableCell className="truncate">{emp?.tel || "-"}</TableCell>
                  <TableCell>{vacationDays}</TableCell>
                  <TableCell>{usedVacationDays}</TableCell>
                  <TableCell>{isDisabled ? "-" : Number(emp.rate)}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      className="cursor-pointer hover:bg-bl"
                      variant="secondary"
                      type="button"
                      size="sm"
                      onClick={() => {
                        form.reset({
                          ...emp,
                          mail: emp.mail || "",
                          tel: emp.tel || "",
                        });
                        setIsOpen(true);
                      }}
                      disabled={isDisabled}
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
                    <Button
                      className="cursor-pointer hover:bg-bl"
                      variant="default"
                      size="sm"
                      type="button"
                      onClick={() => router.push(`/employees?empId=${emp.id}`)}
                    >
                      <TreePalmIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
