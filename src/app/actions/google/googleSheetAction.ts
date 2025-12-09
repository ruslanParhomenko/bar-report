export type StandardKitchen = {
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

const GOOGLE_SHEET_URL_SK =
  "https://script.google.com/macros/s/AKfycbx9e6tBAsTpDg2augJ7CBaYIocKoSD5n1kWUhpLv1Ntkwd5GGnjpEXIP_Nw_KLYPMDWtw/exec";
const GOOGLE_SHEET_URL_MENIU =
  "https://script.google.com/macros/s/AKfycbwWC1DjZz2VL3qFScaVfMoSRWMqQCP9rUjogZveFW6mL2z-Ss7mPZUwMqGvKx-A1Kb86A/exec";

export async function getStandardKitchen(): Promise<StandardKitchen[]> {
  const res = await fetch(GOOGLE_SHEET_URL_SK, {
    next: { revalidate: 60 * 60 * 24 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch StandardKitchen");
  return res.json();
}
export async function getMenu(): Promise<Menu> {
  const res = await fetch(GOOGLE_SHEET_URL_MENIU, {
    next: { revalidate: 60 * 60 * 24 }, // 1 раз в 24 часа
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch Menu");
  return res.json();
}
