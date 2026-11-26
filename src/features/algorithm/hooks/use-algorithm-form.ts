import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAlgorithmData } from "../actions/create-algorithm";
import {
  type AlgorithmData,
  algorithmSchema,
  defaultValues,
  FIELD_CONFIG,
} from "../model/schema";

export function useAlgorithmForm({
  data,
  tab,
}: {
  data: AlgorithmData | null;
  tab: string;
}) {
  const { setIsEdit } = useEdit();

  const initData = FIELD_CONFIG.reduce((acc, key) => {
    acc[key] = data?.[key] || [defaultValues];
    return acc;
  }, {} as AlgorithmData);

  const form = useForm<AlgorithmData>({
    resolver: zodResolver(algorithmSchema),
    defaultValues: initData,
  });

  const onSubmit: SubmitHandler<AlgorithmData> = async (data) => {
    const dataByTab = { [tab]: data[tab] };

    await createAlgorithmData(dataByTab, tab);

    toast.success(`Алгоритм ${tab} успешно сохранён!`);
    setIsEdit(false);
  };
  return {
    form,
    onSubmit,
  };
}
