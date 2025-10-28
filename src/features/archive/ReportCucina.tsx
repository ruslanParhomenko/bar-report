"use client";
import ReportCucinaTable from "@/components/table/report-cucina-table/ReportCucinaTable";
import { ReportCucinaData } from "@/constants/type";
import { useState } from "react";
import FilterArchiveData from "./FilterArchiveData";
import { formatSelectData, getFilterKeys } from "./helpers";
import { REPORT_CUCINA_ENDPOINT } from "@/constants/endpoint-tag";

export default function ReportCucina({ data }: { data: ReportCucinaData[] }) {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  return (
    <>
      <FilterArchiveData
        options={getFilterKeys(data[0])}
        dateSelect={formatSelectData(data)}
        setFilteredData={setFilteredData}
        data={data}
        nameTag={REPORT_CUCINA_ENDPOINT}
      />
      {filteredData.length > 0 &&
        filteredData.map((report, index: number) => (
          <ReportCucinaTable key={index} data={report} />
        ))}
    </>
  );
}
