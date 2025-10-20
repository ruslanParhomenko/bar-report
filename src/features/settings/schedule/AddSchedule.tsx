"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/providers/EmployeesProvider";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import SelectField from "@/components/inputs/SelectField";
import { MonthYearPicker } from "@/components/inputs/MonthYearPicker";
import TextInput from "@/components/inputs/TextInput";
import { SHIFT_OPTIONS, SHIFT_TYPES, WAITER_EMPLOYEES } from "../constants";

interface ShiftRow {
  id: string;
  number: number;
  dayHours: number;
  nightHours: number;
  totalHours: number;
  shiftType: string;
  employee: string;
  shifts: (string | null)[];
}

interface ScheduleTableProps {
  dataRange?: any;
}

export function ScheduleTable({ dataRange }: ScheduleTableProps) {
  const employees = useEmployees();
  const selectedEmployees = Array.isArray(employees)
    ? employees
        .filter((employee) => WAITER_EMPLOYEES.includes(employee.role as any))
        .map((employee) => employee.name)
    : [];

  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  const form = useForm({
    defaultValues: {
      month: "",
      rowShifts: [] as ShiftRow[],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  const month = form.watch("month");

  const getMonthDays = () => {
    if (!month) return [];
    const [monthName, yearStr] = month.split("-");
    const year = parseInt(yearStr, 10);
    if (isNaN(year)) return [];

    const monthIndex = new Date(
      Date.parse(`${monthName} 1, ${year}`)
    ).getMonth();

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, monthIndex, i + 1);
      return {
        day: i + 1,
        weekday: date.toLocaleDateString("ru-RU", { weekday: "short" }),
      };
    });
  };

  const monthDays = getMonthDays();
  const todayDay = new Date().getDate();

  // Инициализация
  useEffect(() => {
    if (fields.length === 0) addNewRow();
  }, []);

  useEffect(() => {
    const todayIndex = monthDays.findIndex((day) => day.day === todayDay);
    if (todayIndex !== -1) {
      setSelectedColumn(todayIndex);
    }
  }, [monthDays, todayDay]);

  // Соответствие значения смены количеству часов
  const SHIFT_HOURS_MAP_DAY: Record<string, number> = {
    "8": 12,
    "9": 12,
    "14": 8,
    "18": 4,
    "20": 4,
  };

  const SHIFT_HOURS_MAP_NIGHT: Record<string, number> = {
    "8": 0,
    "9": 0,
    "14": 4,
    "18": 8,
    "20": 8,
  };

  // Функция для обновления часов в строке
  const updateRowHours = (rowIndex: number) => {
    const shifts = form.getValues(`rowShifts.${rowIndex}.shifts`) || [];

    const totalHoursDay = shifts.reduce(
      (sum, val) => sum + (SHIFT_HOURS_MAP_DAY[val as string] ?? 0),
      0
    );

    const totalHoursNight = shifts.reduce(
      (sum, val) => sum + (SHIFT_HOURS_MAP_NIGHT[val as string] ?? 0),
      0
    );

    const totalHours = totalHoursDay + totalHoursNight;

    // Обновляем значения в форме
    form.setValue(`rowShifts.${rowIndex}.dayHours`, totalHoursDay);
    form.setValue(`rowShifts.${rowIndex}.nightHours`, totalHoursNight);
    form.setValue(`rowShifts.${rowIndex}.totalHours`, totalHours);
  };

  // Отслеживаем изменения в сменах
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Если изменилась какая-то смена, обновляем соответствующий ряд
      if (name?.includes("shifts")) {
        const match = name.match(/rowShifts\.(\d+)\.shifts/);
        if (match) {
          const rowIndex = parseInt(match[1]);
          updateRowHours(rowIndex);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Добавление новой строки
  const addNewRow = () => {
    const newRow: ShiftRow = {
      id: Date.now().toString(),
      number: fields.length + 1,
      dayHours: 0,
      nightHours: 0,
      totalHours: 0,
      shiftType: "",
      employee: "",
      shifts: Array(monthDays.length).fill(null),
    };
    append(newRow);
  };

  // Удаление строки
  const removeRow = (index: number) => {
    remove(index);
  };

  // Сброс формы
  const resetForm = () => {
    form.reset({
      month: "",
      rowShifts: [],
    });
    setSelectedColumn(null);
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="p-4 flex items-center justify-between gap-2">
          <MonthYearPicker name="month" />
          <div className="flex gap-2">
            <Button onClick={addNewRow} size="sm" type="button">
              <Plus className="h-4 w-4 mr-2" />
              Добавить строку
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={resetForm}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Сбросить
            </Button>
          </div>
        </div>

        <Table className="table-fixed">
          <TableBody>
            <TableRow>
              <TableCell className="w-2"></TableCell>
              <TableCell className="w-6">d</TableCell>
              <TableCell className="w-6">n</TableCell>
              <TableCell className="w-6">t</TableCell>
              <TableCell className="w-12">shift</TableCell>
              <TableCell className="w-36">employee</TableCell>

              {monthDays.map((day) => (
                <TableCell
                  key={day.day}
                  className={"w-8 p-0 text-center cursor-pointer"}
                >
                  <div className="text-sm font-semibold">{day.day}</div>
                  <div className="text-xs text-muted-foreground">
                    {day.weekday}
                  </div>
                </TableCell>
              ))}
              <TableCell className="w-4"></TableCell>
            </TableRow>

            {fields.map((row, rowIndex) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                <TableCell className="border-0">{rowIndex + 1}</TableCell>

                <TableCell className="border-0">
                  <input
                    {...form.register(`rowShifts.${rowIndex}.dayHours`)}
                    className="border-0 text-center w-6 p-0"
                    readOnly
                  />
                </TableCell>

                <TableCell className="border-0">
                  <input
                    {...form.register(`rowShifts.${rowIndex}.nightHours`)}
                    className="border-0 text-center w-6 p-0"
                    readOnly
                  />
                </TableCell>

                <TableCell className="border-0">
                  <input
                    {...form.register(`rowShifts.${rowIndex}.totalHours`)}
                    className="border-0 text-center w-6 p-0"
                    readOnly
                  />
                </TableCell>

                <TableCell className="border-0">
                  <SelectField
                    fieldName={`rowShifts.${rowIndex}.shiftType`}
                    data={SHIFT_TYPES}
                    className="w-12 p-1"
                  />
                </TableCell>

                <TableCell className="border-0">
                  <SelectField
                    fieldName={`rowShifts.${rowIndex}.employee`}
                    data={selectedEmployees}
                    className="w-36 p-1"
                  />
                </TableCell>

                {monthDays.map((_day, dayIndex) => (
                  <TableCell key={dayIndex} className={"border-0"}>
                    <SelectField
                      fieldName={`rowShifts.${rowIndex}.shifts.${dayIndex}`}
                      data={SHIFT_OPTIONS}
                      className="w-8 p-0"
                      //   onValueChange={() => updateRowHours(rowIndex)}
                    />
                  </TableCell>
                ))}
                <TableCell className="border-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4"
                    onClick={() => removeRow(rowIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button type="submit" className="self-end mt-4">
          Сохранить
        </Button>
      </form>
    </Form>
  );
}
