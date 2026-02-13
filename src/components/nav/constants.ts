// new

export const BAR_NAV_ITEMS = [
  { label: "report", value: "report" },
  { label: "break", value: "break" },
  { label: "penalty", value: "penalty" },
];
export const ARCHIVE_NAV_ITEMS = [
  { label: "bar", value: "bar" },
  { label: "cucina", value: "cucina" },
  { label: "breakList", value: "breakList" },
  { label: "penalty", value: "penalty" },
  { label: "penaltyResult", value: "penaltyResult" },
];
export const SCHEDULE_NAV_ITEMS = [
  { label: "bar", value: "bar" },
  { label: "cucina", value: "cucina" },
  { label: "dish", value: "dish" },
];
export const INFO_NAV_ITEMS = [
  { label: "stopList", value: "stopList" },
  { label: "dailyMenu", value: "daily-menu" },
  { label: "statusMenu", value: "statusMenu" },
  { label: "staffMenu", value: "staffMenu" },
  { label: "menuVip", value: "menuVip" },
  { label: "standardKitchen", value: "standardKitchen" },
];
export const RESULT_NAV_ITEMS = [
  { label: "barmen", value: "barmen" },
  { label: "waiters", value: "waiters" },
  { label: "cucina", value: "cucina" },
  { label: "dish", value: "dish" },
];
export const TTN_NAV_ITEMS = [
  { label: "month", value: "month" },
  { label: "day", value: "day" },
  { label: "year", value: "year" },
];
export const EMPLOYEES_NAV_ITEMS = [
  { label: "employees", value: "employees" },
  { label: "vacation", value: "vacation" },
  { label: "create-employee", value: "create-employee" },
  { label: "users", value: "users" },
  { label: "create-user", value: "create-user" },
];
export const STOP_LIST_NAV_ITEMS = [
  { label: "bar", value: "bar" },
  { label: "cucina", value: "cucina" },
];
export const ORDERS_NAV_ITEMS = [
  { label: "bar-ttn", value: "bar-ttn" },
  { label: "bar-zn", value: "bar-zn" },
  { label: "cucina-ttn", value: "cucina-ttn" },
  { label: "cucina-zn", value: "cucina-zn" },
];

type NAV_BY_PATCH_TYPE = Record<
  string,
  { navItems: PageNavType[]; filterMonth: boolean }
>;

export const NAV_BY_PATCH = {
  bar: { navItems: BAR_NAV_ITEMS, filterMonth: false },
  archive: { navItems: ARCHIVE_NAV_ITEMS, filterMonth: true },
  schedule: { navItems: SCHEDULE_NAV_ITEMS, filterMonth: true },
  info: { navItems: INFO_NAV_ITEMS, filterMonth: false },
  result: { navItems: RESULT_NAV_ITEMS, filterMonth: true },
  ttn: { navItems: TTN_NAV_ITEMS, filterMonth: true },
  employees: { navItems: EMPLOYEES_NAV_ITEMS, filterMonth: false },
  tips: { navItems: [], filterMonth: true },
  cash: { navItems: [], filterMonth: true },
  "a-o": { navItems: [], filterMonth: true },
  "stop-list": { navItems: STOP_LIST_NAV_ITEMS, filterMonth: false },
  orders: { navItems: ORDERS_NAV_ITEMS, filterMonth: false },
} satisfies NAV_BY_PATCH_TYPE;

export type PageNavType = {
  label: string;
  value: string;
};
