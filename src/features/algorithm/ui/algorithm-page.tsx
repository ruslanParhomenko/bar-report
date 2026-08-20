"use client";

import { useEdit } from "@/providers/edit-provider";
import { useSearchParams } from "next/navigation";
import { AlgorithmData, FIELD_CONFIG } from "../model/schema";
import AlgorithmEdit from "./algorithm-edit";
import AlgorithmView from "./algorithm-view";

export function AlgorithmPage({ data }: { data: AlgorithmData | null }) {
  const tab = useSearchParams().get("tab");

  const { isEdit } = useEdit();

  if (isEdit) return <AlgorithmEdit data={data} tab={tab || FIELD_CONFIG[0]} />;

  return <AlgorithmView data={data} tab={tab || FIELD_CONFIG[0]} />;
}
