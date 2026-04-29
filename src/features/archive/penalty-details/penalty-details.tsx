"use client";

import {
  deleteRemarksDay,
  RemarksDataByUniqueKey,
} from "@/app/actions/remarks/remarks-action";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/ability-provider";
import { getMonthDays } from "@/utils/get-month-days";
import { useState } from "react";
import PenaltyDetailsBody from "./penalty-details-body";
import PenaltyDetailsFooter from "./penalty-details-footer";
import PenaltyDetailsHeader from "./penalty-details-header";

export default function PenaltyDetails({
  data,
}: {
  data: RemarksDataByUniqueKey | null;
}) {
  const router = useRouter();

  const { isAdmin, isManager } = useAbility();
  const names = data?.data
    .flatMap((item) => item.remarks.map((r: any) => r.name))
    .filter(
      (name): name is string => typeof name === "string" && name.trim() !== "",
    );
  const employeesList = ["select", ...Array.from(new Set(names))].map(
    (name) => ({
      label: name,
      value: name,
    }),
  );

  const [selectedEmployee, setSelectedEmployee] = useState("select");
  const [selectedDay, setSelectedDay] = useState<string>("0");

  const reversed = data?.data && [...data?.data].reverse();

  const filteredRows =
    reversed?.flatMap((doc) =>
      doc.remarks
        .filter(
          (r: any) =>
            selectedEmployee === "select" || r.name === selectedEmployee,
        )
        .filter(() => selectedDay === "0" || doc.day === selectedDay)
        .map((r: any) => ({
          ...r,
          day: doc.day,
          uniqueKey: data?.id,
        })),
    ) ?? [];

  const editRemarks = (day: string) => {
    if (!isAdmin && !isManager) return;
    if (!data) return;
    router.push(`/penalty-update/${day}?month=${data.month}&year=${data.year}`);
  };
  const deleteRemarks = async (uniqueKey: string, day: string) => {
    if (!isAdmin) return;
    await deleteRemarksDay(uniqueKey, day);
  };
  if (!data) return null;
  const { monthDays } = getMonthDays({ month: data.month, year: data.year });

  return (
    <table className="w-full table-fixed">
      <PenaltyDetailsHeader
        options={employeesList}
        value={selectedEmployee}
        setValue={setSelectedEmployee}
        monthDays={monthDays}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <PenaltyDetailsBody
        rows={filteredRows}
        editRemarks={editRemarks}
        deleteRemarks={deleteRemarks}
      />

      <PenaltyDetailsFooter data={data} />
    </table>
  );
}
