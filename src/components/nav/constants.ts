import {
  AO_REPORT_ACTION_TAG,
  BREAK_ACTION_TAG,
  BREAK_REALTIME_ACTION_TAG,
  CASH_ACTION_TAG,
  EMPLOYEES_ACTION_TAG,
  REMARKS_ACTION_TAG,
  REMARKS_REALTIME_ACTION_TAG,
  SCHEDULE_ACTION_TAG,
  STOP_LIST_ACTION_TAG,
  TIPS_ACTION_TAG,
  TTN_ACTION_TAG,
  USERS_ACTION_TAG,
} from "@/constants/action-tag";
import {
  AO_REPORT_MAIN_ROUTE,
  BREAK_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  REMARKS_MAIN_ROUTE,
  SCHEDULE_MAIN_ROUTE,
  STOP_LIST_MAIN_ROUTE,
  TIPS_MAIN_ROUTE,
  TTN_MAIN_ROUTE,
  USERS_MAIN_ROUTE,
} from "@/constants/endpoint-tag";

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

export const STOP_LIST_NAV_ITEMS = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
];

export const USERS_NAV_ITEMS = [
  { title: "users", href: "" },
  { title: "add", href: "create" },
];

export const PENALTY_NAV_ITEMS = [
  { title: "form", href: "form" },
  { title: "details", href: "details" },
  { title: "general", href: "general" },
];

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

  // schedule: { navItems: SCHEDULE_NAV_ITEMS, filterType: "month" },
  // employees: { navItems: EMPLOYEES_NAV_ITEMS, filterType: "role" },
  // reports: { navItems: REPORTS_NAV_ITEMS, filterType: "none" },
  // break: { navItems: BREAK_REMARKS_NAV_ITEMS, filterType: "month" },
  // "orders-ttn": { navItems: ORDERS_NAV_ITEMS, filterType: "none" },
  // "orders-zn": { navItems: ORDERS_NAV_ITEMS, filterType: "none" },
  // info: { navItems: INFO_NAV_ITEMS, filterType: "none" },
  // archive: { navItems: [], filterType: "month" },
  // "stop-list": { navItems: STOP_LIST_NAV_ITEMS, filterType: "none" },
  // users: { navItems: USERS_NAV_ITEMS, filterType: "none" },
  // penalty: { navItems: PENALTY_NAV_ITEMS, filterType: "month" },
  // tips: { navItems: [], filterType: "month" },
  // cash: { navItems: [], filterType: "month" },
  // "a-o": { navItems: [], filterType: "month" },
  // ttn: { navItems: TTN_NAV_ITEMS, filterType: "month" },
  // result: { navItems: RESULT_NAV_ITEMS, filterType: "month" },
} satisfies NAV_BY_PATCH_TYPE;

export type PageNavType = {
  label: string;
  value: string;
};

export const REVALIDATE_TAGS_BY_PATCH = {
  [SCHEDULE_MAIN_ROUTE]: SCHEDULE_ACTION_TAG,
  [EMPLOYEES_MAIN_ROUTE]: EMPLOYEES_ACTION_TAG,
  [BREAK_MAIN_ROUTE]: BREAK_REALTIME_ACTION_TAG,
  [USERS_MAIN_ROUTE]: USERS_ACTION_TAG,
  [STOP_LIST_MAIN_ROUTE]: STOP_LIST_ACTION_TAG,
  [AO_REPORT_MAIN_ROUTE]: AO_REPORT_ACTION_TAG,
  [CASH_MAIN_ROUTE]: CASH_ACTION_TAG,
  [REMARKS_MAIN_ROUTE]: REMARKS_REALTIME_ACTION_TAG,
  [TIPS_MAIN_ROUTE]: TIPS_ACTION_TAG,
  [TTN_MAIN_ROUTE]: TTN_ACTION_TAG,
};

// nav router

export const REPORT_NAV_ROUTES = [
  { title: "bar", href: "report-bar" },
  { title: "breakList", href: "break" },
  { title: "penalty", href: "penalty" },
];
