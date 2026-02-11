"use client";

import { Activity, useEffect, useState, useTransition } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportDataByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";
import { ReportCucinaDataByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import ReportCucinaTable from "@/components/table/report-cucina-table/ReportCucinaTable";
import { BreakGetType } from "@/app/actions/break/break-action";
import { BreakListArchive } from "../break/break-list-archive";
import { RemarksDataByUniqueKey } from "@/app/actions/remarks/remarks-action";
import PenaltyDetails from "../penalty/penalty-details";
import PenaltyGeneral from "../penalty/penalty-general";
import SelectByMonthYear from "@/components/nav/select-month-year";
import { MONTHS } from "@/utils/getMonthDays";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TabValue = "bar" | "cucina" | "breakList" | "penalty" | "penaltyResult";
export type ArchiveData = {
  bar: ReportDataByUniqueKey | null;
  cucina: ReportCucinaDataByUniqueKey | null;
  breakList: BreakGetType | null;
  penalty: RemarksDataByUniqueKey | null;
  penaltyResult: RemarksDataByUniqueKey | null;
};
export default function ArchivePage({
  archiveData,
}: {
  archiveData: ArchiveData;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentMonth =
    searchParams.get("month") ?? MONTHS[new Date().getMonth()];

  const currentYear =
    searchParams.get("year") ?? new Date().getFullYear().toString();

  const [tab, setTab] = useState<TabValue>("bar");
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const handleTabChange = (value: string) => {
    if (
      value === "bar" ||
      value === "cucina" ||
      value === "breakList" ||
      value === "penalty" ||
      value === "penaltyResult"
    ) {
      setTab(value);
    }
  };

  const navItems = [
    { label: "bar", value: "bar" },
    { label: "cucina", value: "cucina" },
    { label: "breakList", value: "breakList" },
    { label: "penalty", value: "penalty" },
    { label: "penaltyResult", value: "penaltyResult" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("month", month);
    params.set("year", year);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [month, year, pathname]);

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="flex-1">
      <div className="flex items-center justify-between my-2 px-4">
        <TabsList className="flex md:gap-2 h-8 w-120">
          {navItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="hover:text-bl cursor-pointer w-1/5"
            >
              <span className="truncate block w-full text-xs md:text-md text-bl">
                {item.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        <SelectByMonthYear
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
          isLoading={isPending}
          classNameMonthYear={navItems.length > 0 ? "md:w-22 w-10" : "w-24"}
        />
      </div>
      <TabsContent value="bar">
        <Activity mode={tab === "bar" ? "visible" : "hidden"}>
          <ReportBarTable data={archiveData.bar} />
        </Activity>
      </TabsContent>

      <TabsContent value="cucina">
        <Activity mode={tab === "cucina" ? "visible" : "hidden"}>
          <ReportCucinaTable data={archiveData.cucina} />
        </Activity>
      </TabsContent>

      <TabsContent value="breakList">
        <Activity mode={tab === "breakList" ? "visible" : "hidden"}>
          <BreakListArchive data={archiveData.breakList} />
        </Activity>
      </TabsContent>

      <TabsContent value="penalty">
        <Activity mode={tab === "penalty" ? "visible" : "hidden"}>
          <PenaltyDetails data={archiveData.penalty} />
        </Activity>
      </TabsContent>

      <TabsContent value="penaltyResult">
        <Activity mode={tab === "penaltyResult" ? "visible" : "hidden"}>
          <PenaltyGeneral data={archiveData.penaltyResult} />
        </Activity>
      </TabsContent>
    </Tabs>
  );
}
