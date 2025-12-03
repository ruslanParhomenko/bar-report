"use client";

import { useState, useMemo, useEffect } from "react";
import PenaltyTable, { PenaltyTableProps } from "./PenaltyTable";
import { months } from "./constants";
import SelectFilter from "./SelectFilter";
import { useUniqueOptions } from "@/hooks/useUniqueOptions";
import { isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import TotalPenalty from "./TotalPenalty";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useRemarks } from "@/providers/RemarksProvider";
import { useAbility } from "@/providers/AbilityProvider";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { RemarksData } from "@/app/actions/remarks/remarksAction";

export const PagePenalty = ({ data }: { data: RemarksData["remarks"] }) => {
  console.log("PenaltyPage data", data);
  const { isBar, isCucina, isAdmin, isManager } = useAbility();
  const isViewer = isAdmin || isBar || isCucina || isManager;
  const t = useTranslations("Home");
  const [isOpenTotal, setIsOpenTotal] = useState(false);

  const employeesList = useUniqueOptions({
    data: data?.flatMap((d) => d.remarks),
    getValue: (r) => r.name,
    allLabel: t("all"),
  });

  // const [selectedEmployee, setSelectedEmployee] = useState("all");

  const filteredRows = useMemo(() => {
    return data?.flatMap((report) => {
      const date = new Date(report.date);
      if (!isValid(date)) return [];

      const formattedDate = date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return (report.remarks ?? []).map(
        (r): Omit<PenaltyTableProps, "reportId"> => ({
          date: formattedDate,
          name: r.name,
          dayHours: r.dayHours,
          nightHours: r.nightHours,
          reason: r.reason,
          penalty: r.penalty,
          bonus: r.bonus,
          month: date.getMonth().toString(),
          id: report.id,
        })
      );
    });
  }, [data]);

  // useEffect(() => {
  //   const month = new Date().getMonth().toString();
  //   setSelectedMonth(month);
  // }, []);

  return isViewer ? (
    <div>
      {/* <div className="flex flex-wrap items-center gap-4">
        <SelectFilter
          data={monthsList}
          value={selectedMonth}
          setValue={setSelectedMonth}
        />
        <SelectFilter
          data={employeesList}
          value={selectedEmployee}
          setValue={setSelectedEmployee}
        />
        <Button
          variant={"secondary"}
          className="text-rd"
          onClick={() => {
            setSelectedMonth("");
            setSelectedEmployee("all");
          }}
        >
          {t("reset")}
        </Button>
        <div className="flex items-center space-x-2">
          <Switch
            id="toggle-total"
            checked={isOpenTotal}
            onCheckedChange={(checked) => setIsOpenTotal(checked)}
          />
          <Label htmlFor="toggle-total">
            {isOpenTotal ? t("details") : t("general")}
          </Label>
        </div>
      </div> */}

      {isOpenTotal ? (
        <TotalPenalty data={filteredRows ?? []} />
      ) : (
        <PenaltyTable data={filteredRows ?? []} />
      )}
    </div>
  ) : (
    <InsufficientRights />
  );
};
