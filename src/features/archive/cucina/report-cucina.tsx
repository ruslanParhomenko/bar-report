"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import RemainsTable from "./remains-table";
import WriteOffTable from "./write-off-table";
import PreparedTable from "./prepared-table";
import { classNameHead } from "../bar/report-bar";
import { ReportCucinaDataByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import ShiftsTable from "./shifts-table";
import StaffTable from "./staff-table";

export const classNameHeadCucina = "text-shadow-muted-foreground font-bold";
export const classNameRowBorderCucina = "border-b-bl";

export default function ReportCucinaTable({
  data,
}: {
  data: ReportCucinaDataByUniqueKey | null;
}) {
  const [opened, setOpened] = useState<number[]>([]);

  useEffect(() => {
    if (!data) return;
    if (reversed.length > 0) {
      setOpened([0]);
    }
  }, [data]);

  const toggle = (index: number) => {
    setOpened((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  if (!data) return null;
  const reversed = [...data.data].reverse();
  return (
    <>
      {reversed.map((item, index) => {
        const reportData = item.report;
        const isOpen = opened.includes(index);

        const prepared = [
          ...(reportData?.cutting?.filter((i) => i.product) || []),
          ...(reportData?.preparedDesserts?.filter((i) => i.product) || []),
          ...(reportData?.preparedSalads?.filter((i) => i.product) || []),
          ...(reportData?.preparedSeconds?.filter((i) => i.product) || []),
        ];

        return (
          <Card
            key={index}
            className="bg-background! shadow-none m-2 cursor-pointer"
            onClick={() => toggle(index)}
          >
            {/* Показываем только card + day */}
            <CardTitle className="text-xs text-bl p-4">
              day: {item.day}
            </CardTitle>

            {isOpen && (
              <>
                <CardContent className="grid grid-cols-1 xl:grid-cols-4 gap-4 pb-4">
                  <div>
                    <ShiftsTable data={reportData?.shifts} />
                    <RemainsTable data={reportData?.remains} />
                  </div>
                  <WriteOffTable data={reportData?.writeOff} />
                  <PreparedTable data={prepared} />
                  <StaffTable data={reportData?.staff} />
                </CardContent>

                <CardFooter>
                  <div className={classNameHead}>
                    notes:{" "}
                    <span className="text-rd text-xs px-4">
                      {reportData?.notes}
                    </span>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        );
      })}
    </>
  );
}
