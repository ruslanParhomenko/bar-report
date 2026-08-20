import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAlgorithmData } from "../actions/create-algorithm";
import {
  AlgorithmData,
  algorithmSchema,
  defaultAlgorithm,
} from "../model/schema";

export function useAlgoritmForm({ data }: { data: AlgorithmData | null }) {
  const { setIsEdit } = useEdit();

  const form = useForm<AlgorithmData>({
    resolver: zodResolver(algorithmSchema),
    defaultValues: data || defaultAlgorithm,
  });

  const onSubmit: SubmitHandler<AlgorithmData> = async (data) => {
    await createAlgorithmData(data);
    toast.success("Алгоритм успешно сохранён!");
    setIsEdit(false);
  };
  return {
    form,
    onSubmit,
  };
}
