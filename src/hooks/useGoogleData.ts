"use client";

import { useQuery } from "@tanstack/react-query";

// const GOOGLE_SHEET_URL_EMPLOYEES =
//   "https://script.google.com/macros/s/AKfycbzRbakMVlKXM_oDNnCLlY7gHhNPnEdNh6RaeI4U7fw7Z1vFiaHR9_w1MhbjBC8TPjjH/exec";
const GOOGLE_SHEET_URL_SK =
  "https://script.google.com/macros/s/AKfycbx9e6tBAsTpDg2augJ7CBaYIocKoSD5n1kWUhpLv1Ntkwd5GGnjpEXIP_Nw_KLYPMDWtw/exec";
const GOOGLE_SHEET_URL_MENIU =
  "https://script.google.com/macros/s/AKfycbwWC1DjZz2VL3qFScaVfMoSRWMqQCP9rUjogZveFW6mL2z-Ss7mPZUwMqGvKx-A1Kb86A/exec";

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
export type StaffMenu = {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
};

export type MenuDepartament = {
  product: string;
  description: string[];
};
export type Menu = {
  daily: DailyMeniu;
  vip: [VipMeniu[], VipMeniu[], VipMeniu[]];
  staff: StaffMenu;
  statusMenu: {
    platinum: string[];
    gold: string[];
    silver: string[];
    loyal: string[];
  };
  menuDepartament: MenuDepartament[];
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
  // const qc = useQueryClient();
  // const employeesQuery = useQuery({
  //   queryKey: ["google", GOOGLE_SHEET_URL_EMPLOYEES],
  //   queryFn: () => fetchGoogle<EmployeesUsers>(GOOGLE_SHEET_URL_EMPLOYEES),
  //   enabled: true,
  //   staleTime: Infinity,
  //   gcTime: 1000 * 60 * 60 * 24,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  //   refetchOnMount: false,
  //   retry: 1,
  // });

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

  // const invalidate = () => {
  //   qc.invalidateQueries({ queryKey: ["google", GOOGLE_SHEET_URL_EMPLOYEES] });
  //   qc.invalidateQueries({ queryKey: ["google", GOOGLE_SHEET_URL_SK] });
  //   qc.invalidateQueries({ queryKey: ["google", GOOGLE_SHEET_URL_MENIU] });
  // };

  return {
    // employees: employeesQuery.data?.employees || [],
    // users: employeesQuery.data?.user || [],
    sk: skQuery.data || [],
    menu: menuQuery.data,
    menuDepartments: menuQuery.data?.menuDepartament,
    statusMenu: menuQuery.data?.statusMenu,
    isLoading: skQuery.isLoading,
  };
}
