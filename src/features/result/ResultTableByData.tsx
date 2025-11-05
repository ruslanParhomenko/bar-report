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

const percentTips = 0.28;
const waitersDishBid = 0.03;
const barmenDishBid = 0.07;
const dishDishBid = 0.07;

export default function EmployeeTables({ data }: { data: any[] }) {
  const t = useTranslations("Home");
  // Разделяем по ролям
  const roles = {
    waiters: data.filter((e) => e.role === "waiters"),
    barmen: data.filter((e) => e.role === "barmen"),
    dish: data.filter((e) => e.role === "dish"),
    cucina: data.filter((e) => e.role === "cook"),
  };

  // Общие tips у waiters
  const totalWaitersTips = roles.waiters.reduce(
    (acc, w) => acc + Number(w.tips || 0),
    0
  );

  const tipsForBarmen = totalWaitersTips * percentTips * 0.6;
  const tipsForDish = totalWaitersTips * percentTips * 0.4;

  const totalBarmenDayHours = roles.barmen.reduce(
    (acc, b) => acc + Number(b.dayHours || 0),
    0
  );
  const totalBarmenNightHours = roles.barmen.reduce(
    (acc, b) => acc + Number(b.nightHours || 0),
    0
  );
  const totalBarmenHours = totalBarmenDayHours + totalBarmenNightHours;
  const coefficientDayNight = totalBarmenDayHours / totalBarmenHours;
  const coefficientBarmen = tipsForBarmen / totalBarmenHours;

  const totalDishDayHours = roles.dish.reduce(
    (acc, d) => acc + Number(d.dayHours || 0),
    0
  );
  const totalDishNightHours = roles.dish.reduce(
    (acc, d) => acc + Number(d.nightHours || 0),
    0
  );
  const totalDishHours = totalDishDayHours + totalDishNightHours;
  const coefficientDish = tipsForDish / totalDishHours;

  const renderTable = (role: string, employees: any[]) => {
    // Сортировка по имени сотрудника от А до Я
    const sortedEmployees = [...employees].sort((a, b) =>
      a.employee.localeCompare(b.employee)
    );

    function roundToNearest5(value: number) {
      return Math.round(value / 5) * 5;
    }

    return (
      <AccordionWrapper nameTag={role} key={role} className="md:px-10">
        <Table className="table-fixed ">
          <TableHeader>
            <TableRow>
              <TableHead className="w-50"></TableHead>
              <TableHead className="w-30">{t("rate")}</TableHead>
              <TableHead>{t("tips")}</TableHead>
              <TableHead>{t("penalty")}</TableHead>
              <TableHead>{t("bonus")}</TableHead>
              <TableHead className="w-15">day</TableHead>
              <TableHead className="w-15">night</TableHead>
              <TableHead className="w-15">hours</TableHead>
              <TableHead className="w-30">salary</TableHead>
              <TableHead className="w-30">result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.map((e) => {
              const dayH = Number(e.dayHours || 0);
              const nightH = Number(e.nightHours || 0);
              const totalHours = dayH + nightH;
              const rate = Number(e.rate || 0);

              const salary =
                (rate / 180) * 0.9 * dayH + (rate / 180) * 1.15 * nightH;

              let sendTips = 0;
              const tips = Number(e.tips || 0);
              const otherWaitersTips = totalWaitersTips - tips;

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
                console.log("tipsByWaiters", tipsByWaiters);
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

              return (
                <TableRow key={e.employeeId}>
                  <TableCell>{e.employee}</TableCell>
                  <TableCell>{rate}</TableCell>
                  <TableCell>{sendTips.toFixed(0)}</TableCell>
                  <TableCell>{e.penality}</TableCell>
                  <TableCell>{e.bonus}</TableCell>
                  <TableCell>{dayH}</TableCell>
                  <TableCell>{nightH}</TableCell>
                  <TableCell>{totalHours}</TableCell>
                  <TableCell>{salary.toFixed(0)}</TableCell>
                  <TableCell>
                    {Number(salary.toFixed(0)) +
                      Number(sendTips) -
                      Number(e.penality) +
                      Number(e.bonus)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AccordionWrapper>
    );
  };

  return (
    <div className="p-4">
      {renderTable("waiters", roles.waiters)}
      {renderTable("barmen", roles.barmen)}
      {renderTable("dish", roles.dish)}
      {renderTable("cucina", roles.cucina)}
    </div>
  );
}
