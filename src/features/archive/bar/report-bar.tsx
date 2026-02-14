"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import TobaccoTable from "./tobacco-table";
import CashVerifyTable from "./cash-table";
import ExpensesTable from "./expenses-table";
import InventoryTable from "./inventory-table";
import ProductTransferTable from "./transfer-table";

import { ReportDataByUniqueKey } from "@/app/actions/report-bar/report-bar-action";

export const classNameHead = "text-shadow-muted-foreground font-bold";
export const classNameRowBorder = "border-b-bl";

export default function ReportBarTable({
  data,
}: {
  data: ReportDataByUniqueKey | null;
}) {
  const [opened, setOpened] = useState<number[]>([]);

  if (!data) return null;

  const reversedData = [...data.data].reverse();

  // ✅ первый элемент сразу открыт
  useEffect(() => {
    if (reversedData.length > 0) {
      setOpened([0]);
    }
  }, [data]);

  const toggle = (index: number) => {
    setOpened(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // закрыть
          : [...prev, index], // открыть
    );
  };

  return (
    <>
      {reversedData.map((item, index) => {
        const reportData = item.report;
        const isOpen = opened.includes(index);

        return (
          <Card
            key={index}
            className="bg-background! shadow-none m-2 cursor-pointer"
            onClick={() => toggle(index)}
          >
            <CardTitle className="text-xs text-bl p-4">
              day: {item.day}
            </CardTitle>

            {isOpen && (
              <CardContent className="flex flex-col gap-4 pb-4">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                  <TobaccoTable data={reportData?.tobacco} />
                  <ExpensesTable data={reportData?.expenses} />
                  <ProductTransferTable data={reportData?.productTransfer} />
                  <InventoryTable data={reportData?.inventory} />
                </div>

                <div>
                  <CashVerifyTable data={reportData?.cashVerify} />
                  <div className={classNameHead}>
                    notes:{" "}
                    <span className="text-rd text-xs px-4">
                      {reportData?.notes}
                    </span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </>
  );
}
