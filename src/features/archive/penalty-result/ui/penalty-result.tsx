"use client";

import PenaltyResultEmployee from "@/features/archive/penalty-result/ui/penalty-result-employee";
import PenaltyTable from "@/features/archive/penalty-result/ui/penalty-table";
import type { GetRemarksData } from "@/features/penalty/model/type";

import { useState } from "react";

export function PenaltyResult({ data }: { data: GetRemarksData[] | null }) {
  const [selectedEmployee, setSelectedEmployee] = useState("");

  if (!data) return null;

  return (
    <div className="relative rounded-lg border p-4">
      <PenaltyTable
        data={data}
        setSelectedEmployee={setSelectedEmployee}
        selectedEmployee={selectedEmployee}
      />
      {selectedEmployee && (
        <PenaltyResultEmployee
          selectedEmployee={selectedEmployee}
          data={data}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}
    </div>
  );
}
