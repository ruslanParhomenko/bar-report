"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import PenaltyTable from "./PenaltyTable";
import { months } from "./constants";
import SelectFilter from "./SelectFilter";
import { useUniqueOptions } from "@/hooks/useUniqueOptions";
import { isValid } from "date-fns";
import { RemarkData } from "@/constants/type";
import { Remark } from "@/generated/prisma";

const HALF_DAY = 1000 * 60 * 60 * 12;

function PenaltyPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["remarks"],
    queryFn: () => fetch("/api/remarks").then((res) => res.json()),
    staleTime: HALF_DAY,
    gcTime: HALF_DAY,
  });

  const employeesList = useUniqueOptions<Remark>({
    data: data.flatMap((r: RemarkData) => r.remarks || []),
    getValue: (r) => r.name,
    allLabel: "Все сотрудники",
  });

  const monthsList = useUniqueOptions<RemarkData>({
    data,
    getValue: (item) => {
      if (!isValid(new Date(item?.date))) return undefined;
      return new Date(item.date).getMonth();
    },
    getLabel: (monthIndex) => months[Number(monthIndex)],
    allLabel: "Все месяцы",
  });

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const filteredRows = useMemo(() => {
    if (!data?.length) return [];

    return data.flatMap((report: RemarkData) => {
      const date = new Date(report.date);
      const formattedDate = `${String(date.getDate()).padStart(
        2,
        "0"
      )}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;

      return (report.remarks || [])
        .map((r) => ({
          date: formattedDate,
          name: r.name,
          dayHours: r.dayHours,
          nightHours: r.nightHours,
          reason: r.reason,
          penality: r.penality,
          month: date.getMonth().toString(),
        }))
        .filter((row) => {
          const matchMonth =
            selectedMonth === "all" || row.month === selectedMonth;
          const matchEmployee =
            selectedEmployee === "all" || row.name === selectedEmployee;
          return matchMonth && matchEmployee;
        });
    });
  }, [data, selectedMonth, selectedEmployee]);

  if (isLoading) return <div className="p-4">Загрузка...</div>;

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

      <PenaltyTable data={filteredRows} />
    </div>
  );
}

export default PenaltyPage;
