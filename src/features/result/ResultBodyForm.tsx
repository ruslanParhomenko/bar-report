"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AccordionWrapper from "@/components/wrapper/AccordionWrapper";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { calculateSalary, ResultUniqueEmployeeType } from "./utils";
import { MONTHS } from "@/utils/getMonthDays";

export function ResultBodyForm({ data }: { data: ResultUniqueEmployeeType[] }) {
  const t = useTranslations("Home");

  const form = useFormContext();
  const month = form.watch("month");
  const year = Number(form.watch("year"));

  const monthNumber = MONTHS.findIndex(
    (m) => m.toLowerCase() === month.toLowerCase()
  );
  const daysInMonth = new Date(year, monthNumber + 1, 0).getDate();

  // ставки
  const percentTips = Number(form.watch("percentTips")) || 0;
  const waitersDishBid = Number(form.watch("waitersDishBid")) || 0;
  const barmenDishBid = Number(form.watch("barmenDishBid")) || 0;
  const dishDishBid = Number(form.watch("dishDishBid")) || 0;

  // разделение по ролям
  const roles = {
    waiters: data.filter((e) => e.role === "waiters"),
    barmen: data.filter((e) => e.role === "barmen"),
    dish: data.filter((e) => e.role === "dish"),
    cucina: data.filter((e) => e.role === "cook"),
  };

  // общие суммы чаевых
  const totalWaitersTips = roles.waiters.reduce(
    (acc, w) => acc + Number(w.tips ?? 0),
    0
  );
  const tipsForBarmen = totalWaitersTips * percentTips * 0.6;
  const tipsForDish = totalWaitersTips * percentTips * 0.4;

  // часы барменов
  const totalBarmenDayHours = roles.barmen.reduce(
    (acc, b) => acc + Number(b.dayHours || 0),
    0
  );
  const totalBarmenNightHours = roles.barmen.reduce(
    (acc, b) => acc + Number(b.nightHours || 0),
    0
  );
  const totalBarmenHours = totalBarmenDayHours + totalBarmenNightHours;

  const constantHoursByMonth =
    daysInMonth * 24 > totalBarmenHours ? daysInMonth * 24 : totalBarmenHours;

  const coefficientDayNight = totalBarmenDayHours / (totalBarmenHours || 1);
  const coefficientBarmen = tipsForBarmen / (constantHoursByMonth || 1);

  // для мойщиков
  const totalDishDayHours = roles.dish.reduce(
    (acc, d) => acc + Number(d.dayHours || 0),
    0
  );
  const totalDishNightHours = roles.dish.reduce(
    (acc, d) => acc + Number(d.nightHours || 0),
    0
  );
  const totalDishHours = totalDishDayHours + totalDishNightHours;
  const coefficientDish = tipsForDish / (totalDishHours || 1);

  function roundToNearest5(value: number) {
    return Math.round(value / 5) * 5;
  }

  // рендер таблицы для каждой роли
  const renderTable = (role: string, employees: ResultUniqueEmployeeType[]) => {
    const sortedEmployees = [...employees].sort((a, b) =>
      a.employee.localeCompare(b.employee)
    );

    // вычисляем totals
    const totalRow = sortedEmployees.reduce(
      (acc, e) => {
        const { dayH, nightH, totalHours, rate, salary, tips } =
          calculateSalary(e);

        let sendTips = 0;
        if (role === "waiters") {
          sendTips = roundToNearest5(
            tips - tips * waitersDishBid - tips * percentTips
          );
        } else if (role === "barmen") {
          const tipsByWaiters =
            dayH * coefficientBarmen -
            dayH * coefficientBarmen * 0.1 +
            nightH * coefficientBarmen +
            nightH * coefficientBarmen * 0.1 * coefficientDayNight;

          sendTips = roundToNearest5(
            tips + tipsByWaiters - (tips + tipsByWaiters) * barmenDishBid
          );
        } else if (role === "dish") {
          const tipsByWaiters = (dayH + nightH) * coefficientDish;
          sendTips = roundToNearest5(
            tips + tipsByWaiters - (tips + tipsByWaiters) * dishDishBid
          );
        } else if (role === "cook") {
          sendTips = tips;
        }

        const result =
          Number(salary) +
          Number(sendTips) -
          Number(e.penalty) +
          Number(e.bonus);

        acc.tips += Number(sendTips) || 0;
        acc.penalty += Number(e.penalty) || 0;
        acc.bonus += Number(e.bonus) || 0;
        acc.day += Number(dayH) || 0;
        acc.night += Number(nightH) || 0;
        acc.hours += Number(totalHours) || 0;
        acc.salary += Number(salary) || 0;
        acc.result += Number(result) || 0;

        return acc;
      },
      {
        tips: 0,
        penalty: 0,
        bonus: 0,
        day: 0,
        night: 0,
        hours: 0,
        salary: 0,
        result: 0,
      }
    );

    return (
      <AccordionWrapper nameTag={role} key={role} className="md:px-10">
        <Table className="md:table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="md:w-50 w-35"></TableHead>
              <TableHead className="text-center">{t("rate")}</TableHead>
              <TableHead className="text-center">{t("tips")}</TableHead>
              <TableHead className="text-center">{t("penalty")}</TableHead>
              <TableHead className="text-center">{t("bonus")}</TableHead>
              <TableHead></TableHead>
              <TableHead className="text-center">day</TableHead>
              <TableHead className="text-center">night</TableHead>
              <TableHead className="text-center">hours</TableHead>
              <TableHead className="text-center">salary</TableHead>
              <TableHead className="text-center">result</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedEmployees.map((e, index) => {
              const { dayH, nightH, totalHours, rate, salary, tips } =
                calculateSalary(e);

              let sendTips = 0;
              if (role === "waiters") {
                sendTips = roundToNearest5(
                  tips - tips * waitersDishBid - tips * percentTips
                );
              } else if (role === "barmen") {
                const tipsByWaiters =
                  dayH * coefficientBarmen -
                  dayH * coefficientBarmen * 0.1 +
                  nightH * coefficientBarmen +
                  nightH * coefficientBarmen * 0.1 * coefficientDayNight;

                sendTips = roundToNearest5(
                  tips + tipsByWaiters - (tips + tipsByWaiters) * barmenDishBid
                );
              } else if (role === "dish") {
                const tipsByWaiters = (dayH + nightH) * coefficientDish;
                sendTips = roundToNearest5(
                  tips + tipsByWaiters - (tips + tipsByWaiters) * dishDishBid
                );
              } else if (role === "cook") {
                sendTips = tips;
              }

              const result =
                Number(salary) +
                Number(sendTips) -
                Number(e.penalty) +
                Number(e.bonus);

              return (
                <TableRow key={index}>
                  <TableCell className="sticky left-0 bg-background">
                    {e.employee}
                  </TableCell>
                  <TableCell className="text-center">{rate}</TableCell>
                  <TableCell className="text-center font-bold">
                    {sendTips}
                  </TableCell>
                  <TableCell className="text-center text-rd">
                    {e.penalty}
                  </TableCell>
                  <TableCell className="text-center">{e.bonus}</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">{dayH}</TableCell>
                  <TableCell className="text-center">{nightH}</TableCell>
                  <TableCell className="text-center text-gn font-bold">
                    {totalHours}
                  </TableCell>
                  <TableCell className="text-center">{salary}</TableCell>
                  <TableCell className="text-center">{result}</TableCell>
                </TableRow>
              );
            })}

            {/* ✅ Итоговая строка */}
            <TableRow className="font-semibold bg-muted/30">
              <TableCell className="sticky left-0 bg-muted/30">Total</TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-center">{totalRow.tips}</TableCell>
              <TableCell className="text-center text-rd">
                {totalRow.penalty}
              </TableCell>
              <TableCell className="text-center">{totalRow.bonus}</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-center">{totalRow.day}</TableCell>
              <TableCell className="text-center">{totalRow.night}</TableCell>
              <TableCell className="text-center text-gn font-bold">
                {totalRow.hours}
              </TableCell>
              <TableCell className="text-center">{totalRow.salary}</TableCell>
              <TableCell className="text-center">{totalRow.result}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionWrapper>
    );
  };

  return (
    <div>
      {renderTable("waiters", roles.waiters)}
      {renderTable("barmen", roles.barmen)}
      {renderTable("dish", roles.dish)}
      {renderTable("cucina", roles.cucina)}
    </div>
  );
}
