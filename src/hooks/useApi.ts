"use client";
import { fetcher } from "@/lib/fetcher";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseApiOptions {
  endpoint: string;
  queryKey: string | string[];
  staleTime?: number;
  gcTime?: number;
  fetchInit?: boolean;
}

export function useApi<T>({
  endpoint,
  queryKey,
  staleTime = 1000 * 60 * 60 * 12,
  gcTime = 1000 * 60 * 60 * 12,
  fetchInit = true,
}: UseApiOptions) {
  const queryClient = useQueryClient();

  type TCreate = Omit<T, "id" | "createdAt">;

  const api = `/api/${endpoint}`;

  const query = useQuery<T[]>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: () => fetcher(api),
    staleTime: staleTime,
    gcTime: gcTime,
    enabled: fetchInit,
  });

  console.log("query", query);

  const createMutation = useMutation({
    mutationFn: (data: TCreate) =>
      fetcher(api, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetcher(`${api}/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      }),
  });

  return {
    query,
    createMutation,
    deleteMutation,
  };
}
