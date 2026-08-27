"use client";

import { Table } from "@/components/ui/table";

import BidView from "@/features/staff/tips/ui/month/bit-view";
import { TipsViewTableBody } from "@/features/staff/tips/ui/month/tips-view-body";
import { TipsViewTableFooter } from "@/features/staff/tips/ui/month/tips-view-footer";
import { useMonthDays } from "@/hooks/use-month-days";
import { GetTipsData } from "../../model/type";
import TipsHeaderTable from "./tips-header";

export default function TipsViewMonthPage({
  dataTipsYear,
}: {
  dataTipsYear: GetTipsData[];
}) {
  const todayDay = new Date().getDate();

  const { monthDays, month } = useMonthDays();

  const dataTips = dataTipsYear?.find((data) => data.id === month) || null;

  if (!dataTips) {
    return (
      <div className="flex h-full items-center justify-center">
        tips not found
      </div>
    );
  }

  return (
    <>
      <BidView data={dataTips.tipsData} />
      <Table className="table-fixed">
        <TipsHeaderTable
          selectedDay={todayDay}
          setSelectedDay={() => {}}
          addNewRow={() => {}}
          isEdit={false}
        />

        <TipsViewTableBody
          data={dataTips?.tipsData.rowEmployeesTips || []}
          selectedDay={todayDay}
          monthDays={monthDays}
        />

        <TipsViewTableFooter data={dataTips?.tipsData} monthDays={monthDays} />
      </Table>
    </>
  );
}
