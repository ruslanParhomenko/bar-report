import { DeleteListButton } from "@/components/buttons/DeleteListButton";
import RemarksTable from "@/components/table/RemarksTable";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";
import { RemarkReport } from "@/generated/prisma";
import React from "react";

export default function Remarks({
  data,
  invalidate,
}: {
  data: RemarkReport[];
  invalidate?: () => void;
}) {
  if (!data?.length) return null;
  return (
    <>
      {data.map((item: any, index: number) => {
        if (!item.remarks?.length) return null;
        return (
          <React.Fragment key={index}>
            <DeleteListButton
              data={item}
              nameTag={REMARKS_ENDPOINT}
              invalidate={invalidate}
            />
            <RemarksTable data={item.remarks} />
          </React.Fragment>
        );
      })}
    </>
  );
}
