"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";

export type ArchiveData = {
  dailyReportCucina: any[];
  dailyReport: any[];
  remarkReport: any[];
  breakeList: any[];
};

type UseArchiveOptions = {
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
  endpoint?: string;
};

export function useArchive({
  staleTime = 1000 * 60 * 60 * 12,
  gcTime = 1000 * 60 * 60 * 12,
  enabled = true,
  endpoint = "/api/archive",
}: UseArchiveOptions = {}) {
  const queryClient = useQueryClient();

  const query = useQuery<ArchiveData>({
    queryKey: ["archive"],
    queryFn: () => fetcher(endpoint),
    staleTime,
    gcTime: gcTime,
    enabled,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["archive"] });

  return {
    ...query,
    invalidate,
  };
}
