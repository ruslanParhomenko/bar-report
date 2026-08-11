"use client";

import { Table } from "@/components/ui/table";
import { DataTTN } from "@/features/settings/setting/model/type";
import { GetTTNData } from "../../moda-month/model/type";
import { getAllAgentData } from "../lib/utils";
import TtnModaBodyTable from "./ttn-moda-body";
import TtnModaFooterTable from "./ttn-moda-footer";
import TtnModaHeaderTable from "./ttn-moda-header";

export function TtnYearPage({
  data,
  agentTTN,
}: {
  data: GetTTNData[] | null;
  agentTTN: DataTTN["agent"];
}) {
  const allAgentData = getAllAgentData(data, agentTTN);
  return (
    <Table className="table-fixed">
      <TtnModaHeaderTable />

      <TtnModaBodyTable data={allAgentData} />

      <TtnModaFooterTable data={allAgentData} />
    </Table>
  );
}
