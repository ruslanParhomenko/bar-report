"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import CashVerifyTable from "./cash-table";
import ExpensesTable from "./expenses-table";
import InventoryTable from "./inventory-table";
import TobaccoTable from "./tobacco-table";
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

  useEffect(() => {
    if (!data) return;
    if (reversedData.length > 0) {
      setOpened([0]);
    }
  }, [data]);

  const toggle = (index: number) => {
    setOpened((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
  if (!data) return null;
  const reversedData = [...data.data].reverse();

  return (
    <>
      {reversedData.map((item, index) => {
        const reportData = item.report;
        const isOpen = opened.includes(index);

        return (
          <Card
            key={index}
            className="bg-background! m-2 cursor-pointer shadow-none"
            onClick={() => toggle(index)}
          >
            <CardTitle className="text-bl p-4 text-xs">
              day: {item.day}
            </CardTitle>

            {isOpen && (
              <CardContent className="flex flex-col gap-4 pb-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                  <TobaccoTable data={reportData?.tobacco} />
                  <ExpensesTable data={reportData?.expenses} />
                  <ProductTransferTable data={reportData?.productTransfer} />
                  <InventoryTable data={reportData?.inventory} />
                </div>

                <div>
                  <CashVerifyTable data={reportData?.cashVerify} />
                  <div className={classNameHead}>
                    notes:{" "}
                    <span className="text-rd px-4 text-xs">
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
