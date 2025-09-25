"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

const GOOGLE_SHEET_URL_EMPLOYEES =
  "https://script.google.com/macros/s/AKfycbzRbakMVlKXM_oDNnCLlY7gHhNPnEdNh6RaeI4U7fw7Z1vFiaHR9_w1MhbjBC8TPjjH/exec";
const GOOGLE_SHEET_URL_SK =
  "https://script.google.com/macros/s/AKfycbx9e6tBAsTpDg2augJ7CBaYIocKoSD5n1kWUhpLv1Ntkwd5GGnjpEXIP_Nw_KLYPMDWtw/exec";
const GOOGLE_SHEET_URL_MENIU =
  "https://script.google.com/macros/s/AKfycbzujtXxjZ7aRrVl6_Jb8jV0G3un4hxl2NQvUKHKcxuCTFKy2I9A_syGCFxG0MV2i1lIKg/exec";
export type Employee = {
  rate: number;
  date: string;
  name: string;
  position: string;
  totalVacation: number;
  vacation: number;
};

export type User = {
  id: number;
  mail: string;
  role: string;
  isActive: boolean;
};

export type StandartKitchen = {
  name: string;
  timePlus: string;
  timeMinus: string;
};

export type DailyMeniu = {
  titleDesserts: string[];
  titleMain: string[];
  titleSalad: string[];
  titleSecond: string[];
};

export type VipMeniu = {
  title: string;
  listGramm: string[];
  listItem: string[];
  listPrice: number[];
};
export type Menu = {
  daily: DailyMeniu;
  vip: [VipMeniu[], VipMeniu[], VipMeniu[]];
  statusMenu: {
    platinum: string[];
    gold: string[];
    silver: string[];
    loyal: string[];
  };
};

type EmployeesUsers = {
  employees: Employee[];
  user: User[];
};

async function fetchGoogle<T>(endpoint: string): Promise<T> {
  const res = await fetch(endpoint, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });
  const data = await res.json();
  return data;
}

export function useGoogleData() {
  const qc = useQueryClient();
  const employeesQuery = useQuery({
    queryKey: ["google", GOOGLE_SHEET_URL_EMPLOYEES],
    queryFn: () => fetchGoogle<EmployeesUsers>(GOOGLE_SHEET_URL_EMPLOYEES),
    enabled: true,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });

  const skQuery = useQuery({
    queryKey: ["google", GOOGLE_SHEET_URL_SK],
    queryFn: () => fetchGoogle<StandartKitchen[]>(GOOGLE_SHEET_URL_SK),
    enabled: true,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });

  const menuQuery = useQuery({
    queryKey: ["google", GOOGLE_SHEET_URL_MENIU],
    queryFn: () => fetchGoogle<Menu>(GOOGLE_SHEET_URL_MENIU),
    enabled: true,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["google", GOOGLE_SHEET_URL_EMPLOYEES] });
    qc.invalidateQueries({ queryKey: ["google", GOOGLE_SHEET_URL_SK] });
    qc.invalidateQueries({ queryKey: ["google", GOOGLE_SHEET_URL_MENIU] });
  };

  console.log(menuQuery.data);

  return {
    employees: employeesQuery.data?.employees || [],
    users: employeesQuery.data?.user || [],
    sk: skQuery.data || [],
    menu: menuQuery.data,
    statusMenu: menuQuery.data?.statusMenu,
    isLoading: employeesQuery.isLoading || skQuery.isLoading,
    invalidate,
  };
}
