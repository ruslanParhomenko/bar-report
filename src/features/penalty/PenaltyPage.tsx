"use client";

import { useState, useMemo } from "react";
import PenaltyTable, { PenaltyTableProps } from "./PenaltyTable";
import { months } from "./constants";
import SelectFilter from "./SelectFilter";
import { useUniqueOptions } from "@/hooks/useUniqueOptions";
import { isValid } from "date-fns";
import { RemarkData } from "@/constants/type";
import { Remark } from "@/generated/prisma";
import { useApi } from "@/hooks/useApi";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";
import { Button } from "@/components/ui/button";
import TotalPenalty from "./TotalPenalty";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const PenaltyPage = () => {
  const [isOpenTotal, setIsOpenTotal] = useState(false);
  const { query } = useApi<RemarkData>({
    endpoint: REMARKS_ENDPOINT,
    queryKey: REMARKS_ENDPOINT,
    fetchInit: true,
  });
  const { data } = query;
  const employeesList = useUniqueOptions<Remark>({
    data: data?.flatMap((r) => r?.remarks ?? []) ?? [],
    getValue: (r) => r.name,
    allLabel: "Все сотрудники",
  });

  const monthsList = useUniqueOptions<RemarkData>({
    data: data ?? [],
    getValue: (item) => {
      const date = new Date(item?.date);
      return isValid(date) ? date.getMonth().toString() : undefined;
    },
    getLabel: (monthIndex) => months[Number(monthIndex)],
    allLabel: "Все месяцы",
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
          (r): Omit<PenaltyTableProps, "id" | "reportId"> => ({
            date: formattedDate,
            name: r.name,
            dayHours: r.dayHours,
            nightHours: r.nightHours,
            reason: r.reason,
            penality: r.penality,
            bonus: r.bonus,
            month: date.getMonth().toString(),
          })
        )
        .filter(
          (row) =>
            (selectedMonth === "all" || row.month === selectedMonth) &&
            (selectedEmployee === "all" || row.name === selectedEmployee)
        );
    });
  }, [selectedMonth, selectedEmployee]);

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
          reset
        </Button>
        <div className="flex items-center space-x-2">
          <Switch
            id="toggle-total"
            checked={isOpenTotal}
            onCheckedChange={(checked) => setIsOpenTotal(checked)}
          />
          <Label htmlFor="toggle-total">
            {isOpenTotal ? "Подробно" : "Итоговый"}
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
