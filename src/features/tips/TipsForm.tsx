"use client";

import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { defaultTipsForm, TipsFormType, tipsSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ScheduleHeader from "../settings/schedule/ScheduleHeader";
import { useEffect, useMemo } from "react";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Minus, RotateCcw } from "lucide-react";
import SelectField from "@/components/inputs/SelectField";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import SelectScheduleEmployee from "@/components/inputs/SelectScheduleEmployee";
import { useEmployees } from "@/providers/EmployeesProvider";
import { cn } from "@/lib/utils";
import { handleTableNavigation } from "@/utils/handleTableNavigation";

const SELECTED_ROLE = ["barmen", "waiters", "dish"];

export default function TipsForm() {
  const router = useRouter();
  const t = useTranslations("Home");

  // инициализация формы
  const form = useForm<TipsFormType>({
    resolver: yupResolver(tipsSchema) as unknown as Resolver<TipsFormType>,
    defaultValues: defaultTipsForm,
  });

  const { fields, remove, append, move, replace } = useFieldArray({
    control: form.control,
    name: "rowEmployeesTips",
  });

  const month = form.watch("month");
  const year = form.watch("year");

  // список сотрудников
  const employees = useEmployees();
  const selectedEmployees = useMemo(() => {
    return employees
      .filter((emp) => SELECTED_ROLE.includes(emp.role))
      .filter((emp) => !["barmen", "waiter", "dish"].includes(emp.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees]);

  // вычисляем дни месяца
  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  // когда выбран месяц или год — создаем строки для всех сотрудников
  useEffect(() => {
    if (!month || !year || selectedEmployees.length === 0) return;

    const newRows = selectedEmployees.map((employee, index) => ({
      id: (index + 1).toString(),
      employeeId: employee.id ?? "",
      employee: employee.name ?? "",
      role: employee.role ?? "",
      rate: "",
      tips: "",
      tipsByDay: Array(monthDays.length).fill(""),
    }));

    form.setValue("rowEmployeesTips", newRows);
  }, [month, year, selectedEmployees, monthDays.length]);

  // сброс формы
  const resetForm = () => {
    form.reset(defaultTipsForm);
    replace([]); // очищаем таблицу
  };

  // сброс конкретной строки
  const resetRow = (rowIndex: number) => {
    const currentData = form.getValues();
    const updatedRows = currentData.rowEmployeesTips.map((row, index) => {
      if (index !== rowIndex) return row;
      return {
        ...row,
        tipsByDay: row.tipsByDay.map(() => ""),
        tips: "",
      };
    });

    const updatedData = { ...currentData, rowEmployeesTips: updatedRows };
    form.reset(updatedData);
  };

  // отправка формы
  const onSubmit = (data: TipsFormType) => {
    console.log("Submitted data:", data);
  };
  // добавить новую строку вручную
  const addNewRow = () => {
    append({
      id: (fields.length + 1).toString(),
      employeeId: "",
      employee: "",
      role: "",
      rate: "",
      tips: "",
      tipsByDay: Array(monthDays.length).fill(""),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="flex flex-col"
      >
        {/* Верхняя панель управления */}
        <div className="flex justify-between md:justify-start items-center gap-2 md:gap-6 py-4">
          <SelectField
            fieldName="month"
            data={MONTHS}
            placeHolder="month"
            className="w-16 p-1 text-xs"
          />

          <input
            {...form.register("year")}
            type="text"
            className="w-10 text-xs h-8 hidden"
            placeholder="year"
          />

          <Button
            size="sm"
            onClick={() => {
              resetForm();
              router.back();
            }}
            variant="outline"
            type="button"
            className="w-16 p-1 text-rd cursor-pointer text-xs"
          >
            {t("exit")}
          </Button>

          <Button
            className="cursor-pointer text-bl text-xs p-1"
            variant="outline"
            size="sm"
            type="button"
            onClick={resetForm}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button type="submit" className="w-20 p-1 text-xs" size="sm">
            {t("save")}
          </Button>
        </div>

        {/* Таблица */}
        <Table className="md:table-fixed">
          {month && (
            <ScheduleHeader monthDays={monthDays} addNewRow={addNewRow} />
          )}

          <TableBody className="[&_input]:h-8 [&_input]:text-md [&_input]:py-0.5 [&_input]:text-center [&_input]:w-8 [&_input]:border-0">
            {fields.map((row, rowIndex) => (
              <TableRow key={row.id} className="hover:text-rd p-0 h-10">
                {/* Номер строки */}
                <TableCell
                  className="text-rd cursor-pointer w-2 p-0"
                  onClick={() => remove(rowIndex)}
                >
                  {rowIndex + 1}
                </TableCell>
                <TableCell className="w-6" />
                <TableCell className="w-6" />

                {/* Сумма чаевых */}
                <TableCell className="p-0 text-center">
                  <input
                    {...form.register(`rowEmployeesTips.${rowIndex}.tips`)}
                    className="font-bold"
                    readOnly
                  />
                </TableCell>

                {/* Имя сотрудника */}
                <TableCell className="sticky left-0 p-0 bg-white">
                  <SelectScheduleEmployee
                    fieldName={`rowEmployeesTips.${rowIndex}.employee`}
                    data={selectedEmployees}
                    className="w-32 px-1 hover:text-rd justify-start"
                  />
                </TableCell>

                {/* Кнопка сброса строки */}
                <TableCell
                  className="w-4 cursor-pointer p-0"
                  onClick={() => resetRow(rowIndex)}
                >
                  <Minus className="w-3 h-3" />
                </TableCell>

                {/* Дни месяца */}
                {monthDays.map((_day, dayIndex) => (
                  <TableCell key={dayIndex} className="p-0 text-center w-10">
                    <input
                      {...form.register(
                        `rowEmployeesTips.${rowIndex}.tipsByDay.${dayIndex}`
                      )}
                      data-row={rowIndex}
                      data-col={dayIndex}
                      onKeyDown={(e) =>
                        handleTableNavigation(e, rowIndex, dayIndex)
                      }
                      className={cn("w-10")}
                    />
                  </TableCell>
                ))}

                {/* Перемещение строк вверх/вниз */}
                <TableCell className="w-6 flex flex-col justify-center items-center p-0">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={rowIndex === 0}
                    onClick={() => move(rowIndex, rowIndex - 1)}
                    className="w-3 h-3 p-0 flex items-center justify-center"
                  >
                    <ChevronUp className="w-2 h-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={rowIndex === fields.length - 1}
                    onClick={() => move(rowIndex, rowIndex + 1)}
                    className="w-3 h-3 p-0 flex items-center justify-center"
                  >
                    <ChevronDown className="w-2 h-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </Form>
  );
}
