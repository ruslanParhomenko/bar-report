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
import { ResultUniqueEmployeeType } from "./utils";

export  function ResultBodyForm({ data }: { data: ResultUniqueEmployeeType[] }) {
  const t = useTranslations("Home");

  const form = useFormContext();

  // set bid
  const percentTips = form.watch("percentTips");
  const waitersDishBid = form.watch("waitersDishBid");
  const barmenDishBid = form.watch("barmenDishBid");
  const dishDishBid = form.watch("dishDishBid");
  
  // roles
  const roles = {
    waiters: data.filter((e) => e.role === "waiters"),
    barmen: data.filter((e) => e.role === "barmen"),
    dish: data.filter((e) => e.role === "dish"),
    cucina: data.filter((e) => e.role === "cook"),
  };

  // total tips 
  const totalWaitersTips = roles.waiters.reduce((acc, w) => acc + Number(w.tips ?? 0),0);
  const tipsForBarmen = totalWaitersTips * percentTips * 0.6;
  const tipsForDish = totalWaitersTips * percentTips * 0.4;


  // total hours
  const totalBarmenDayHours = roles.barmen.reduce(
    (acc, b) => acc + Number(b.dayHours || 0),
    0
  );
  const totalBarmenNightHours = roles.barmen.reduce(
    (acc, b) => acc + Number(b.nightHours || 0),
    0
  );

  // bid barmen
  const totalBarmenHours = totalBarmenDayHours + totalBarmenNightHours;
  const coefficientDayNight = totalBarmenDayHours / totalBarmenHours;
  const coefficientBarmen = tipsForBarmen / totalBarmenHours;


  // total hours dish
  const totalDishDayHours = roles.dish.reduce(
    (acc, d) => acc + Number(d.dayHours || 0),
    0
  );
  const totalDishNightHours = roles.dish.reduce(
    (acc, d) => acc + Number(d.nightHours || 0),
    0
  );
  const totalDishHours = totalDishDayHours + totalDishNightHours;

  // bid dish
  const coefficientDish = tipsForDish / totalDishHours;

  
  // render helper
  const renderTable = (role: string, employees: ResultUniqueEmployeeType[]) => {
    
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
              <TableHead className="md:w-50 w-35"></TableHead>
              <TableHead className="md:w-30 w-15 text-center">{t("rate")}</TableHead>
              <TableHead className="md:w-30 w-15 text-center truncate">{t("tips")}</TableHead>
              <TableHead className="md:w-30 w-15 text-center truncate">{t("penalty")}</TableHead>
              <TableHead className="md:w-30 w-15 text-center truncate">{t("bonus")}</TableHead>
              <TableHead></TableHead>
              <TableHead className="md:w-15 w-10">day</TableHead>
              <TableHead className="md:w-15 w-10">night</TableHead>
              <TableHead className="md:w-15 w-10">hours</TableHead>
              <TableHead className="md:w-30 w-15">salary</TableHead>
              <TableHead className="md:w-30 w-15">result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.map((e,index) => {
              const dayH = Number(e.dayHours || 0);
              const nightH = Number(e.nightHours || 0);
              const totalHours = dayH + nightH;
              const rate = Number(e.rate || 0);

              const salary =
                ((rate / 180) * 0.9 * dayH + (rate / 180) * 1.15 * nightH).toFixed(0);

              let sendTips = 0;
              const tips = Number(e.tips || 0);

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

              const result = Number(salary) + Number(sendTips) - Number(e.penalty) + Number(e.bonus);

              return (
                <TableRow key={index}>
                  <TableCell className="sticky left-0">{e.employee}</TableCell>
                  <TableCell className="text-center">{rate}</TableCell>
                  <TableCell className="text-center font-bold">{sendTips}</TableCell>
                  <TableCell className="text-center text-rd">{e.penalty}</TableCell>
                  <TableCell className="text-center">{e.bonus}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{dayH}</TableCell>
                  <TableCell>{nightH}</TableCell>
                  <TableCell className="text-gn font-bold">{totalHours}</TableCell>
                  <TableCell>{salary}</TableCell>
                  <TableCell>{result}</TableCell>
                </TableRow>
              );
            })}
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
