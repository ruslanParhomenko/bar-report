export const SCHEDULE_NAV_ITEMS = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
  { title: "dish", href: "dish" },
];

export const EMPLOYEES_NAV_ITEMS = [
  { title: "employees", href: "" },
  { title: "add", href: "create" },
];

export const REPORTS_NAV_ITEMS = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
];

export const BREAK_REMARKS_NAV_ITEMS = [
  { title: "form", href: "form" },
  { title: "archive", href: "archive" },
];

export const ORDERS_NAV_ITEMS = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
];

export const INFO_NAV_ITEMS = [
  { title: "dailyMenu", href: "daily-menu" },
  { title: "statusMenu", href: "statusMenu" },
  { title: "staffMenu", href: "staffMenu" },
  { title: "menuVip", href: "menuVip" },
  { title: "standardKitchen", href: "standardKitchen" },
];

export const ARCHIVE_NAV_ITEMS = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
];

export const STOP_LIST_NAV_ITEMS = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
];

export const USERS_NAV_ITEMS = [
  { title: "users", href: "" },
  { title: "add", href: "create" },
];

export const PENALTY_NAV_ITEMS = [
  { title: "details", href: "details" },
  { title: "general", href: "general" },
];

export const TTN_NAV_ITEMS = [
  { title: "day", href: "day" },
  { title: "month", href: "month" },
  { title: "year", href: "year" },
];

export const RESULT_NAV_ITEMS = [
  { title: "barmen", href: "barmen" },
  { title: "waiters", href: "waiters" },
  { title: "cucina", href: "cucina" },
  { title: "dish", href: "dish" },
];

//
type NAV_BY_PATCH_TYPE = Record<
  string,
  { navItems: PageNavType[]; filterType: "month" | "role" | "none" }
>;

export const NAV_BY_PATCH = {
  schedule: { navItems: SCHEDULE_NAV_ITEMS, filterType: "month" },
  employees: { navItems: EMPLOYEES_NAV_ITEMS, filterType: "role" },
  reports: { navItems: REPORTS_NAV_ITEMS, filterType: "none" },
  "break-remarks": { navItems: BREAK_REMARKS_NAV_ITEMS, filterType: "month" },
  "orders-ttn": { navItems: ORDERS_NAV_ITEMS, filterType: "none" },
  "orders-zn": { navItems: ORDERS_NAV_ITEMS, filterType: "none" },
  info: { navItems: INFO_NAV_ITEMS, filterType: "none" },
  archive: { navItems: ARCHIVE_NAV_ITEMS, filterType: "month" },
  "stop-list": { navItems: STOP_LIST_NAV_ITEMS, filterType: "none" },
  users: { navItems: USERS_NAV_ITEMS, filterType: "none" },
  penalty: { navItems: PENALTY_NAV_ITEMS, filterType: "month" },
  tips: { navItems: [], filterType: "month" },
  cash: { navItems: [], filterType: "month" },
  "a-o": { navItems: [], filterType: "month" },
  ttn: { navItems: TTN_NAV_ITEMS, filterType: "month" },
  result: { navItems: RESULT_NAV_ITEMS, filterType: "month" },
} satisfies NAV_BY_PATCH_TYPE;

export type PageNavType = {
  title: string;
  href: string;
};
