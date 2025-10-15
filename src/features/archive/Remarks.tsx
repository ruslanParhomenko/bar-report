"use client";
import RemarksTable from "@/components/table/RemarksTable";
import { RemarkData } from "@/constants/type";
import { useState } from "react";
import FilterArchiveData from "./FilterArchiveData";
import { formatSelectData, getSelectByName } from "./helpers";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";

export default function Remarks({
  data,
  invalidate,
}: {
  data: RemarkData[];
  invalidate?: () => void;
}) {
  const [filteredData, setFilteredData] = useState<any[]>([]);

  return (
    <>
      <FilterArchiveData
        options={getSelectByName(data || [], "remarks")}
        dateSelect={formatSelectData(data)}
        setFilteredData={setFilteredData}
        data={data}
        nameTag={REMARKS_ENDPOINT}
      />
      {filteredData.map((item) => (
        <RemarksTable key={item.id} data={item} invalidate={invalidate} />
      ))}
    </>
  );
}
