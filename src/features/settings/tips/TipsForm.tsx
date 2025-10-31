"use client";

import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { defaultTipsForm, TipsFormType, tipsSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ScheduleHeader from "../schedule/ScheduleHeader";
import { useEffect, useMemo, useRef } from "react";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Minus, Plus, RotateCcw } from "lucide-react";
import SelectField from "@/components/inputs/SelectField";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import SelectScheduleEmployee from "@/components/inputs/SelectScheduleEmployee";
import { useEmployees } from "@/providers/EmployeesProvider";
import { cn } from "@/lib/utils";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { useParams } from "next/navigation";
import { saveTipsForm } from "@/app/actions/tips/tipsAction";

const SELECTED_ROLE = ["barmen", "waiters", "dish"];

const ROLES: Array<"waiters" | "barmen" | "dish"> = [
  "waiters",
  "barmen",
  "dish",
];

export default function TipsForm() {
  const router = useRouter();
  const t = useTranslations("Home");

  const { id } = useParams();
  const todayDay = new Date().getDate();

  // инициализация формы
  const form = useForm<TipsFormType>({
    resolver: yupResolver(tipsSchema) as unknown as Resolver<TipsFormType>,
    defaultValues: defaultTipsForm,
  });

  const { fields, remove, append, move, replace } = useFieldArray({
    control: form.control,
    name: "rowEmployeesTips",
  });

  const formDataRef = useRef<TipsFormType>(form.getValues());
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Функция отправки формы
  const onSubmit = async (data: TipsFormType) => {
    console.log(data);
    try {
      // Если есть id, обновляем; иначе создаем новую запись
      await saveTipsForm(data);
      console.log("Форма сохранена:", data);
      formDataRef.current = data; // обновляем ссылку на текущие данные
    } catch (err) {
      console.error("Ошибка при сохранении формы:", err);
    }
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

  const rowsByRole = useMemo(() => {
    const groups: Record<string, typeof fields> = {
      waiters: [],
      barmen: [],
      dish: [],
    };
    fields.forEach((row) => {
      if (row.role === "waiters") groups.waiters.push(row);
      else if (row.role === "barmen") groups.barmen.push(row);
      else if (row.role === "dish") groups.dish.push(row);
    });
    return groups;
  }, [fields]);

  // Автосохранение cashTips.tipsByDay через 15 сек
  useEffect(() => {
    // следим только за cashTips.tipsByDay
    const subscription = form.watch((value, { name }) => {
      if (!name?.startsWith("cashTips.tipsByDay")) return;

      // сбрасываем предыдущий таймер
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      // таймер 15 секунд
      saveTimeoutRef.current = setTimeout(() => {
        onSubmit(form.getValues());
      }, 15000);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [form]);

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
            <TableHeader>
              <TableRow>
                <TableCell className="w-3 text-start p-0" />
                <TableCell className="w-30 p-0 front-bold text-center">
                  {month?.toUpperCase() || ""}
                </TableCell>

                {monthDays.map((day) => {
                  return (
                    <TableCell
                      key={day.day}
                      className={cn(
                        "w-8 cursor-pointer p-0",
                        day.day === todayDay && "text-rd front-bold"
                      )}
                    >
                      <div className="text-sm font-semibold text-center">
                        {day.day}
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        {day.weekday}
                      </div>
                    </TableCell>
                  );
                })}

                <TableCell className="w-6" />
              </TableRow>
            </TableHeader>
          )}

          {ROLES.map((role, roleIndex) => {
            const roleRows = fields.filter((row) => row.role === role);
            if (roleRows.length === 0) return null;

            return (
              <tbody key={role}>
                {/* Разделитель между ролями */}
                {roleIndex > 0 && (
                  <tr>
                    <td
                      colSpan={monthDays.length + 3}
                      className="h-2 bg-bl"
                    ></td>
                  </tr>
                )}

                {/* Кнопка добавить строку для этой роли */}
                <tr>
                  <td colSpan={monthDays.length + 3} className="p-1 text-start">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        append({
                          id: (fields.length + 1).toString(),
                          employeeId: "",
                          employee: "",
                          role: role, // важный момент
                          rate: "",
                          tips: "",
                          tipsByDay: Array(monthDays.length).fill(""),
                        })
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>

                {roleRows.map((row, rowIndex) => {
                  const globalIndex = fields.indexOf(row); // индекс в общей таблице
                  const rowNumber = Object.values(rowsByRole)
                    .flat()
                    .findIndex((r) => r.id === row.id);
                  return (
                    <TableRow key={row.id} className="hover:text-rd p-0 h-6">
                      <TableCell
                        className="text-rd cursor-pointer p-0 h-6"
                        onClick={() => remove(globalIndex)}
                      >
                        {rowIndex + 1}
                      </TableCell>

                      <TableCell className="sticky left-0 p-0 bg-card">
                        <SelectScheduleEmployee
                          fieldName={`rowEmployeesTips.${globalIndex}.employee`}
                          data={selectedEmployees.filter(
                            (emp) => emp.role === role
                          )}
                          className="w-full hover:text-rd justify-start h-6!"
                        />
                      </TableCell>

                      {monthDays.map((_day, dayIndex) => (
                        <TableCell key={dayIndex} className="p-1 h-6">
                          <input
                            {...form.register(
                              `rowEmployeesTips.${globalIndex}.tipsByDay.${dayIndex}`
                            )}
                            data-row={rowNumber} // уникальный и непрерывный индекс
                            data-col={dayIndex}
                            onKeyDown={(e) =>
                              handleTableNavigation(e, rowNumber, dayIndex)
                            }
                            className={cn(
                              "w-full h-6 bg-border text-sm text-center"
                            )}
                          />
                        </TableCell>
                      ))}

                      <TableCell className="w-6 flex flex-col justify-center items-center p-0">
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={rowIndex === 0}
                          onClick={() => {
                            // перемещение вверх внутри своей роли
                            if (rowIndex > 0) {
                              const targetGlobalIndex = fields.indexOf(
                                roleRows[rowIndex - 1]
                              );
                              move(globalIndex, targetGlobalIndex);
                            }
                          }}
                          className="w-3 h-3 p-0 flex items-center justify-center"
                        >
                          <ChevronUp className="w-2 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={rowIndex === roleRows.length - 1}
                          onClick={() => {
                            // перемещение вниз внутри своей роли
                            if (rowIndex < roleRows.length - 1) {
                              const targetGlobalIndex = fields.indexOf(
                                roleRows[rowIndex + 1]
                              );
                              move(globalIndex, targetGlobalIndex);
                            }
                          }}
                          className="w-3 h-3 p-0 flex items-center justify-center"
                        >
                          <ChevronDown className="w-2 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </tbody>
            );
          })}
          <tr>
            <td colSpan={monthDays.length + 3} className="h-2 bg-bl"></td>
          </tr>
          <TableFooter>
            <TableRow>
              <TableCell className="text-rd cursor-pointer p-0 h-6">
                1
              </TableCell>

              <TableCell className="sticky left-0 p-0 bg-card">
                cash tips
              </TableCell>
              {monthDays.map((_day, dayIndex) => (
                <TableCell key={dayIndex} className="p-1 h-6">
                  <input
                    {...form.register(`cashTips.tipsByDay.${dayIndex}`)}
                    data-row={Object.values(rowsByRole).flat().length} // следующий индекс после всех сотрудников
                    data-col={dayIndex}
                    onKeyDown={(e) =>
                      handleTableNavigation(
                        e,
                        Object.values(rowsByRole).flat().length,
                        dayIndex
                      )
                    }
                    className={cn("w-full h-6 bg-border text-sm text-center")}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </form>
    </Form>
  );
}
