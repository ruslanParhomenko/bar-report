"use client";
import { useQuery } from "@tanstack/react-query";

const GOOGLE_SHEET_SK_URL =
  "https://script.google.com/macros/s/AKfycbx9e6tBAsTpDg2augJ7CBaYIocKoSD5n1kWUhpLv1Ntkwd5GGnjpEXIP_Nw_KLYPMDWtw/exec";

async function fetchStandartKitchen() {
  const response = await fetch(GOOGLE_SHEET_SK_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return response.json();
}

export function useStandartKitchen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["standartKitchen"],
    queryFn: fetchStandartKitchen,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isLoading, error };
}
