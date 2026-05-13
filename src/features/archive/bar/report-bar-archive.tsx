"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { GetReportData } from "@/app/actions/report-bar/report-bar-action";
import CashVerifyTable from "./cash-table";
import ExpensesTable from "./expenses-table";
import InventoryTable from "./inventory-table";
import TobaccoTable from "./tobacco-table";
import ProductTransferTable from "./transfer-table";

export const classNameHead = "text-shadow-muted-foreground font-bold";
export const classNameRowBorder = "border-b-bl";

export default function ReportBarArchive({
  data,
}: {
  data: GetReportData[] | null;
}) {
  const [opened, setOpened] = useState<number[]>([]);

  useEffect(() => {
    if (!data) return;
    if (data.length > 0) {
      setOpened([0]);
    }
  }, [data]);

  const toggle = (index: number) => {
    setOpened((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
  if (!data) return null;
  const sortedData = data.sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <>
      {sortedData.map((item, index) => {
        const reportData = item.report;
        const isOpen = opened.includes(index);

        return (
          <Card
            key={index}
            className="bg-background! cursor-pointer shadow-none md:m-2"
            onClick={() => toggle(index)}
          >
            <CardTitle className="text-bl p-4 text-xs">
              day: {item.id}
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
