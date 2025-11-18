"use client";

import { useState, useMemo, useEffect } from "react";
import PenaltyTable, { PenaltyTableProps } from "./PenaltyTable";
import { months } from "./constants";
import SelectFilter from "./SelectFilter";
import { useUniqueOptions } from "@/hooks/useUniqueOptions";
import { isValid } from "date-fns";
import { RemarkData } from "@/constants/type";
import { Remark } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import TotalPenalty from "./TotalPenalty";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useRemarks } from "@/providers/RemarksProvider";

export const PenaltyPage = () => {
  const t = useTranslations("Home");
  const [isOpenTotal, setIsOpenTotal] = useState(false);

  const data = useRemarks();

  const employeesList = useUniqueOptions<Remark>({
    data: data?.flatMap((r) => r?.remarks ?? []) ?? [],
    getValue: (r) => r.name,
    allLabel: t("all"),
  });

  const monthsList = useUniqueOptions<RemarkData>({
    data: data ?? [],
    getValue: (item) => {
      const date = new Date(item?.date);
      return isValid(date) ? date.getMonth().toLocaleString() : undefined;
    },
    getLabel: (monthIndex) => t(months[Number(monthIndex)]),
    allLabel: t("all"),
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const filteredRows = useMemo(() => {
    return data?.flatMap((report) => {
      const date = new Date(report.date);
      if (!isValid(date)) return [];

      const formattedDate = date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return (report.remarks ?? [])
        .map(
          (r): Omit<PenaltyTableProps, "reportId"> => ({
            date: formattedDate,
            name: r.name,
            dayHours: r.dayHours,
            nightHours: r.nightHours,
            reason: r.reason,
            penalty: r.penalty,
            bonus: r.bonus,
            month: date.getMonth().toString(),
            id: report.id,
          })
        )
        .filter(
          (row) =>
            (selectedMonth === "all" || row.month === selectedMonth) &&
            (selectedEmployee === "all" || row.name === selectedEmployee)
        );
    });
  }, [selectedMonth, selectedEmployee, data]);

  useEffect(() => {
    const month = new Date().getMonth().toString();
    setSelectedMonth(month);
  }, []);

  return (
    <div className="md:p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <SelectFilter
          data={monthsList}
          value={selectedMonth}
          setValue={setSelectedMonth}
        />
        <SelectFilter
          data={employeesList}
          value={selectedEmployee}
          setValue={setSelectedEmployee}
        />
        <Button
          variant={"secondary"}
          className="text-rd"
          onClick={() => {
            setSelectedMonth("");
            setSelectedEmployee("all");
          }}
        >
          {t("reset")}
        </Button>
        <div className="flex items-center space-x-2">
          <Switch
            id="toggle-total"
            checked={isOpenTotal}
            onCheckedChange={(checked) => setIsOpenTotal(checked)}
          />
          <Label htmlFor="toggle-total">
            {isOpenTotal ? t("details") : t("general")}
          </Label>
        </div>
      </div>

      {isOpenTotal ? (
        <TotalPenalty data={filteredRows ?? []} />
      ) : (
        <PenaltyTable data={filteredRows ?? []} />
      )}
    </div>
  );
};
