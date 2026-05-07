"use client";

import { GetRemarksData } from "@/app/actions/remarks/remarks-action";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { useState } from "react";
import PenaltyDetailsBody from "./penalty-details-body";
import PenaltyDetailsFooter from "./penalty-details-footer";
import PenaltyDetailsHeader from "./penalty-details-header";

export default function PenaltyDetails({
  data,
}: {
  data: GetRemarksData[] | null;
}) {
  const router = useRouter();

  const { isAdmin, isManager } = useAbility();
  const names = data
    ?.flatMap((item) => item.remarks?.map((r) => r.name))
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

  const sorted = data
    ? [...data].sort((a, b) => Number(b.id) - Number(a.id))
    : [];

  const filteredRows =
    sorted
      ?.filter((doc) => selectedDay === "0" || doc.id === selectedDay)
      .flatMap((doc) =>
        doc.remarks
          ?.filter(
            (r: any) =>
              selectedEmployee === "select" || r.name === selectedEmployee,
          )
          .map((r: any) => ({
            ...r,
            day: doc.id,
          })),
      ) ?? [];
  const { monthDays, month, year } = useMonthDays();

  const editRemarks = (day: string) => {
    if (!isAdmin && !isManager) return;
    if (!data) return;
    router.push(`/penalty-update/${day}?month=${month}&year=${year}`);
  };

  if (!data) return null;

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
      <PenaltyDetailsBody rows={filteredRows} editRemarks={editRemarks} />

      <PenaltyDetailsFooter data={data} />
    </table>
  );
}
