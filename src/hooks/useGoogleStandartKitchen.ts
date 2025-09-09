"use client";
import { useQuery } from "@tanstack/react-query";

const GOOGLE_SHEET_SK_URL =
  "https://script.google.com/macros/s/AKfycbx9e6tBAsTpDg2augJ7CBaYIocKoSD5n1kWUhpLv1Ntkwd5GGnjpEXIP_Nw_KLYPMDWtw/exec";

async function fetchStandartKitchen() {
  const response = await fetch(GOOGLE_SHEET_SK_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  return response.json();
}

export function useStandartKitchen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["standartKitchen"],
    queryFn: fetchStandartKitchen,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });

  return { data, isLoading, error };
}
