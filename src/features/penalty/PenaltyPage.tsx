"use client";

import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PenaltyTable from "./PenaltyTable";
import { months } from "./constants";

const staleTime = 1000 * 60 * 60 * 12;
const gcTime = 1000 * 60 * 60 * 12;

function PenaltyPage() {
  const { theme } = useTheme();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["remarks"],
    queryFn: () => fetch("/api/remarks").then((res) => res.json()),
    staleTime: staleTime,
    gcTime: gcTime,
  });

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const [monthsList, setMonthsList] = useState<
    { value: string; label: string }[]
  >([{ value: "all", label: "Все месяцы" }]);
  const [employeesList, setEmployeesList] = useState<
    { value: string; label: string }[]
  >([{ value: "all", label: "Все сотрудники" }]);

  const [filteredRows, setFilteredRows] = useState<any[]>([]);

  // Собираем список месяцев и сотрудников
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Уникальные месяцы
    const uniqueMonths = [
      { value: "all", label: "Все месяцы" },
      ...Array.from(
        new Set(
          data.map((item: any) => {
            const d = new Date(item.date);
            return d.getMonth().toString();
          })
        )
      )
        .map((monthIndex) => {
          const idx = monthIndex as number; // <- явно говорим TS, что это число
          return {
            value: idx.toString(),
            label: months[idx],
          };
        })
        .filter((m) => m.value !== ""),
    ];
    setMonthsList(uniqueMonths);

    // Уникальные имена сотрудников
    const uniqueEmployees = new Set<string>();
    data.forEach((report: any) =>
      report.remarks.forEach((r: any) => uniqueEmployees.add(r.name))
    );

    const employeeOptions = [
      { value: "all", label: "Все сотрудники" },
      ...Array.from(uniqueEmployees)
        .filter((name) => name && name.trim() !== "") // фильтруем пустые
        .map((name) => ({ value: name, label: name })),
    ];
    setEmployeesList(employeeOptions);
  }, [data]);

  // Формируем все строки таблицы
  useEffect(() => {
    if (!data) return;

    let rows: any[] = [];
    data.forEach((report: any) => {
      const date = new Date(report.date);
      const formattedDate = `${String(date.getDate()).padStart(
        2,
        "0"
      )}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;

      report.remarks.forEach((r: any) => {
        rows.push({
          date: formattedDate,
          name: r.name,
          dayHours: r.dayHours,
          nightHours: r.nightHours,
          reason: r.reason,
          penality: r.penality,
          month: date.getMonth().toString(),
        });
      });
    });

    let filtered = [...rows];

    if (selectedMonth !== "all") {
      filtered = filtered.filter((r) => r.month === selectedMonth);
    }

    if (selectedEmployee !== "all") {
      filtered = filtered.filter((r) => r.name === selectedEmployee);
    }

    setFilteredRows(filtered);
  }, [data, selectedMonth, selectedEmployee]);

  if (isLoading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="md:p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Селект месяца */}
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger
            className={cn(
              "md:w-[200px] w-full",
              theme === "dark" ? "border-0" : ""
            )}
          >
            <SelectValue placeholder="Выберите месяц" />
          </SelectTrigger>
          <SelectContent>
            {monthsList.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Селект сотрудника */}
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger
            className={cn(
              "md:w-[250px] w-full",
              theme === "dark" ? "border-0" : ""
            )}
          >
            <SelectValue placeholder="Выберите сотрудника" />
          </SelectTrigger>
          <SelectContent>
            {employeesList.map((e) => (
              <SelectItem key={e.value} value={e.value}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <PenaltyTable data={filteredRows} />
    </div>
  );
}

export default PenaltyPage;
