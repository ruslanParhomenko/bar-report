import { BAR_REALTIME_ACTION_TAG } from "@/constants/action-tag";

export const BAR_NAV_ITEMS = ["break", "report", "tips"];

export const ARCHIVE_NAV_ITEMS = [
  "bar",
  "cucina",
  "breakList",
  "penalty",
  "penalty-result",
  "tips-add",
];

export const SCHEDULE_NAV_ITEMS = ["bar", "cucina", "dish"];

export const INFO_NAV_ITEMS = [
  "stopList",
  "daily-menu",
  "statusMenu",
  "staffMenu",
  "menuVip",
  "standardKitchen",
];

export const RESULT_NAV_ITEMS = ["barmen", "waiters", "cucina", "dish"];

export const TTN_NAV_ITEMS = ["month", "day", "year"];

export const EMPLOYEES_NAV_ITEMS = [
  "employees",
  "vacation",
  "create-employee",
  "users",
  "create-user",
];

export const STOP_LIST_NAV_ITEMS = ["bar", "cucina"];

export const ORDERS_NAV_ITEMS = [
  "bar-ttn",
  "bar-zn",
  "cucina-ttn",
  "cucina-zn",
];

export const SETTINGS_NAV_ITEMS = [
  "products",
  "break-list",
  "order-products",
  "ttn",
];

export const CASH_NAV_ITEMS = ["cash-month", "cash-year"];

export type NAV_BY_PATCH_TYPE = Record<
  string,
  {
    tabs: string[];
    selectDate: boolean;
    refresh?: boolean;
  }
>;

export const NAV_BY_PATCH = {
  bar: { tabs: BAR_NAV_ITEMS, selectDate: false, refresh: true },
  archive: { tabs: ARCHIVE_NAV_ITEMS, selectDate: true },
  schedule: { tabs: SCHEDULE_NAV_ITEMS, selectDate: true },
  info: { tabs: INFO_NAV_ITEMS, selectDate: false },
  result: { tabs: RESULT_NAV_ITEMS, selectDate: true },
  ttn: { tabs: TTN_NAV_ITEMS, selectDate: true },
  employees: { tabs: EMPLOYEES_NAV_ITEMS, selectDate: false },
  tips: { tabs: [], selectDate: true },
  cash: { tabs: CASH_NAV_ITEMS, selectDate: true },
  "a-o": { tabs: [], selectDate: true },
  "stop-list": { tabs: STOP_LIST_NAV_ITEMS, selectDate: false },
  orders: { tabs: ORDERS_NAV_ITEMS, selectDate: false },
  setting: { tabs: SETTINGS_NAV_ITEMS, selectDate: false },
  "fin-cash": { tabs: [], selectDate: true },
} satisfies NAV_BY_PATCH_TYPE;

export const REFRESH_NAV_ITEMS = {
  bar: BAR_REALTIME_ACTION_TAG,
};
