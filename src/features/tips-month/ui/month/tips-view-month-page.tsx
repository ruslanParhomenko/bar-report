"use client";

import { Table } from "@/components/ui/table";

import BidView from "@/features/tips-month/ui/month/bit-view";
import { TipsViewTableBody } from "@/features/tips-month/ui/month/tips-view-body";
import { TipsInfo } from "@/features/tips-month/ui/month/tips-view-footer";
import { useMonthDays } from "@/hooks/use-month-days";
import { GetTipsData } from "../../model/type";
import TipsHeaderTable from "./tips-header";

export default function TipsViewMonthPage({
  dataTipsMonth,
}: {
  dataTipsMonth: GetTipsData | null;
}) {
  const { monthDays } = useMonthDays();

  if (!dataTipsMonth) {
    return (
      <div className="flex h-full items-center justify-center">
        tips not found
      </div>
    );
  }
  const sortedDataTips = [
    ...(dataTipsMonth?.tipsData.rowEmployeesTips ?? []),
  ].sort(
    (a, b) =>
      a.role.localeCompare(b.role) || a.employee.localeCompare(b.employee),
  );

  return (
    <>
      <BidView data={dataTipsMonth.tipsData} />
      <Table className="table-fixed">
        <TipsHeaderTable
          addNewRow={() => {}}
          selectedDayTips={null}
          setSelectedDayTips={() => null}
          isEdit={false}
        />

        <TipsViewTableBody
          data={sortedDataTips || [{}]}
          monthDays={monthDays}
        />
      </Table>
      <TipsInfo data={dataTipsMonth?.tipsData} />
    </>
  );
}
