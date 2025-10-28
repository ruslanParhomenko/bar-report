"use client";
import BreakTable from "@/components/table/BreakListTable";
import { BreakListData } from "@/constants/type";
import { useState } from "react";
import FilterArchiveData from "./FilterArchiveData";
import { formatSelectData, getSelectByName } from "./helpers";
import { BREAK_LIST_ENDPOINT } from "@/constants/endpoint-tag";

export default function BreakListTable({ data }: { data: BreakListData[] }) {
  const [filteredData, setFilteredData] = useState<BreakListData[]>([]);

  return (
    <>
      <FilterArchiveData
        options={getSelectByName(data || [], "rows")}
        dateSelect={formatSelectData(data)}
        setFilteredData={setFilteredData}
        data={data}
        nameTag={BREAK_LIST_ENDPOINT}
      />
      {filteredData?.length > 0 &&
        filteredData.map((item, index) => {
          if (!item.rows || item.rows.length === 0) return null;
          return <BreakTable key={index} data={item} />;
        })}
    </>
  );
}
