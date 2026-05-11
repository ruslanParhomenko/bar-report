"use client";

import { GetKitchenData } from "@/app/actions/report-kitchen/kitchen-action";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { classNameHead } from "../bar/report-bar-archive";
import PreparedTable from "./prepared-table";
import ShiftsTable from "./shifts-table";
import StaffTable from "./staff-table";
import WriteOffTable from "./write-off-table";

export const classNameHeadCucina = "text-shadow-muted-foreground font-bold";
export const classNameRowBorderCucina = "border-b-bl";

export default function ReportKitchenTable({
  data,
}: {
  data: GetKitchenData[] | null;
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
  const reversed = data.sort((a, b) => Number(b.id) - Number(a.id));
  return (
    <>
      {reversed.map((item, index) => {
        const reportData = item.report;
        const isOpen = opened.includes(index);

        const prepared = [
          ...(reportData?.cutting?.filter((i) => i.product) || []),
          ...(reportData?.preparedFirst?.filter((i) => i.product) || []),
          ...(reportData?.preparedGarnish?.filter((i) => i.product) || []),
          ...(reportData?.preparedDesserts?.filter((i) => i.product) || []),
          ...(reportData?.preparedSalads?.filter((i) => i.product) || []),
          ...(reportData?.preparedSeconds?.filter((i) => i.product) || []),
        ];

        const preparedPersonal = [
          ...(reportData?.staffFurchet?.filter((i) => i.product) || []),
          ...(reportData?.staff?.filter((i) => i.product) || []),
        ];

        return (
          <Card
            key={index}
            className="bg-background! m-2 cursor-pointer shadow-none"
            onClick={() => toggle(index)}
          >
            {/* Показываем только card + day */}
            <CardTitle className="text-bl p-4 text-xs">
              day: {item.id}
            </CardTitle>

            {isOpen && (
              <>
                <CardContent className="grid grid-cols-1 gap-4 pb-4 xl:grid-cols-4">
                  <div>
                    <ShiftsTable data={reportData?.shifts} />
                  </div>
                  <WriteOffTable data={reportData?.writeOff} />
                  <PreparedTable data={prepared} />
                  <StaffTable data={preparedPersonal} />
                </CardContent>

                <CardFooter>
                  <div className={classNameHead}>
                    notes:{" "}
                    <span className="text-rd px-4 text-xs">
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
