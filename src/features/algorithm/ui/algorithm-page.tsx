"use client";

import { useEdit } from "@/providers/edit-provider";
import { AlgorithmData } from "../model/schema";
import AlgorithmEdit from "./algorithm-edit";
import AlgorithmView from "./algorithm-view";

export function AlgorithmPage({
  data,
  tab,
}: {
  data: AlgorithmData | null;
  tab: string;
}) {
  const { isEdit } = useEdit();

  if (isEdit) return <AlgorithmEdit data={data} tab={tab} />;

  return <AlgorithmView data={data} tab={tab} />;
}
