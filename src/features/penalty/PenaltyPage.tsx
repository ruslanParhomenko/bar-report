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

export const PenaltyPage = () => {
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

  const [selectedMonth, setSelectedMonth] = useState("all");
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
            month: date.getMonth().toString(),
          })
        )
        .filter(
          (row) =>
            (selectedMonth === "all" || row.month === selectedMonth) &&
            (selectedEmployee === "all" || row.name === selectedEmployee)
        );
    });
  }, [data, selectedMonth, selectedEmployee]);

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
      </div>

      <PenaltyTable data={filteredRows ?? []} />
    </div>
  );
};
