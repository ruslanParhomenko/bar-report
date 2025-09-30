"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export type ArchiveDataItem = any;

type UseArchiveMutationsOptions = {
  endpoint?: string;
};

export function useArchiveMutations({
  endpoint,
}: UseArchiveMutationsOptions = {}) {
  const api = `/api/${endpoint}`;
  const queryClient = useQueryClient();

  // CREATE
  const createMutation = useMutation({
    mutationFn: async (data: ArchiveDataItem) => {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create archive item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archive"] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      const res = await fetch(`${api}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete archive item");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Запись удалена");
      queryClient.invalidateQueries({ queryKey: ["archive"] });
    },
  });

  return {
    createMutation,
    deleteMutation,
  };
}
