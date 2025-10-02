import { DeleteListButton } from "@/components/buttons/DeleteListButton";
import BreakTable from "@/components/table/BreakListTable";
import RemarksTable from "@/components/table/RemarksTable";
import { BREAK_LIST_ENDPOINT } from "@/constants/endpoint-tag";
import React from "react";

export default function BreakListTable({
  data,
  invalidate,
}: {
  data: any[];
  invalidate?: () => void;
}) {
  return (
    <>
      {data?.length > 0 &&
        data.map((item, index) => (
          <React.Fragment key={index}>
            <DeleteListButton
              data={item as any}
              nameTag={BREAK_LIST_ENDPOINT}
              invalidate={invalidate}
            />
            <BreakTable data={item.rows} />
            <RemarksTable data={item.remarks} />
          </React.Fragment>
        ))}
    </>
  );
}
