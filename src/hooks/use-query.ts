"use client";
import { fetcher } from "@/lib/fetcher";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseApiOptions {
  endpoint: string;
  queryKey: string | string[];
  staleTime?: number;
  gcTime?: number;
}

export function useApi<TData>({
  endpoint,
  queryKey,
  staleTime = 1000 * 60 * 60 * 12,
  gcTime = 1000 * 60 * 60 * 12,
}: UseApiOptions) {
  const queryClient = useQueryClient();

  const api = `/api/${endpoint}`;

  type TGetData = TData & { id: number };

  const query = useQuery<TGetData[]>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: () => fetcher(api),
    staleTime: staleTime,
    gcTime: gcTime,
  });

  const createMutation = useMutation({
    mutationFn: (data: TData) =>
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
