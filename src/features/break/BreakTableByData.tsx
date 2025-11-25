"use client";
import { BreakListData } from "@/constants/type";
import { useState } from "react";
import FilterArchiveData from "../archive/FilterArchiveData";
import { formatSelectData, getSelectByName } from "../archive/helpers";
import { BREAK_LIST_ENDPOINT } from "@/constants/endpoint-tag";
import { BreakArchiveByDay } from "./BreakArchiveByDay";

export function BreakTableByData({ data }: { data: BreakListData[] }) {
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
      <div className="h-[85vh] overflow-auto">
        {filteredData?.length > 0 &&
          filteredData.map((item, index) => {
            if (!item.rows || item.rows.length === 0) return null;
            return <BreakArchiveByDay key={index} data={item} />;
          })}
      </div>
    </>
  );
}
