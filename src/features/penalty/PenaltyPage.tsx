"use client";

import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useForm, FormProvider as Form } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const staleTime = 1000 * 60 * 60 * 12;
const gcTime = 1000 * 60 * 60 * 12;

function PenaltyPage() {
  const { theme } = useTheme();
  const t = useTranslations("Home");
  const form = useForm();

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

  // Подсчёт итоговой суммы штрафов
  const totalPenalty = useMemo(() => {
    return filteredRows.reduce((acc, r) => {
      const val = Number(r.penality);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [filteredRows]);

  if (isLoading) return <div className="p-4">Загрузка...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Ошибка загрузки данных</div>;

  return (
    <Form {...form}>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-lg font-semibold">Отчёты по штрафам</h2>

          {/* Селект месяца */}
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger
              className={cn("w-[200px]", theme === "dark" ? "border-0" : "")}
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
              className={cn("w-[250px]", theme === "dark" ? "border-0" : "")}
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

        <Card className="shadow-md border rounded-2xl">
          <CardHeader>
            <CardTitle>Все штрафы</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRows.length === 0 ? (
              <div className="text-sm text-gray-500 py-4">
                Нет данных за выбранный фильтр
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[130px]">Дата</TableHead>
                    <TableHead className="w-[200px]">Сотрудник</TableHead>
                    <TableHead>Дневные часы</TableHead>
                    <TableHead>Ночные часы</TableHead>
                    <TableHead>Причина</TableHead>
                    <TableHead>Штраф</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.dayHours || "-"}</TableCell>
                      <TableCell>{row.nightHours || "-"}</TableCell>
                      <TableCell>{row.reason || "-"}</TableCell>
                      <TableCell>{row.penality || "-"}</TableCell>
                    </TableRow>
                  ))}

                  {/* Итоговая строка */}
                  <TableRow className="font-semibold bg-muted/50">
                    <TableCell colSpan={5} className="text-right">
                      Общая сумма штрафов:
                    </TableCell>
                    <TableCell>{totalPenalty}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Form>
  );
}

export default PenaltyPage;
