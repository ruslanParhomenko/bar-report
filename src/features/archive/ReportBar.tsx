"use client";
import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";
import { ReportBarData } from "@/constants/type";
import { useState } from "react";
import FilterArchiveData from "./FilterArchiveData";
import { formatSelectData, getFilterKeys } from "./helpers";
import { REPORT_BAR_ENDPOINT } from "@/constants/endpoint-tag";

export default function ReportBar({
  data,
  invalidate,
}: {
  data: ReportBarData[];
  invalidate?: () => void;
}) {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  return (
    <>
      <FilterArchiveData
        options={getFilterKeys(data[0])}
        dateSelect={formatSelectData(data)}
        setFilteredData={setFilteredData}
        data={data}
        nameTag={REPORT_BAR_ENDPOINT}
      />
      {filteredData.length > 0 &&
        filteredData.map((item: ReportBarData, index: number) => (
          <ReportBarTable key={index} data={item} invalidate={invalidate} />
        ))}
    </>
  );
}
