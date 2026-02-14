// new

import {
  SCHEDULE_ACTION_TAG,
  EMPLOYEES_ACTION_TAG,
  BREAK_REALTIME_ACTION_TAG,
  USERS_ACTION_TAG,
  STOP_LIST_ACTION_TAG,
  AO_REPORT_ACTION_TAG,
  CASH_ACTION_TAG,
  REMARKS_REALTIME_ACTION_TAG,
  TIPS_ACTION_TAG,
  TTN_ACTION_TAG,
  BAR_REALTIME_ACTION_TAG,
  CUCINA_REALTIME_ACTION_TAG,
} from "@/constants/action-tag";
import {
  AO_REPORT_MAIN_ROUTE,
  ARCHIVE_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  REPORTS_BAR_ROUTE,
  REPORTS_CUCINA_ROUTE,
  SCHEDULE_MAIN_ROUTE,
  TIPS_MAIN_ROUTE,
  TTN_MAIN_ROUTE,
} from "@/constants/endpoint-tag";

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

//
export const REVALIDATE_TAGS_BY_PATCH = {
  [SCHEDULE_MAIN_ROUTE]: SCHEDULE_ACTION_TAG,
  [AO_REPORT_MAIN_ROUTE]: AO_REPORT_ACTION_TAG,
  [CASH_MAIN_ROUTE]: CASH_ACTION_TAG,
  [TIPS_MAIN_ROUTE]: TIPS_ACTION_TAG,
  [TTN_MAIN_ROUTE]: TTN_ACTION_TAG,
  [REPORTS_BAR_ROUTE]: BAR_REALTIME_ACTION_TAG,
  [REPORTS_CUCINA_ROUTE]: CUCINA_REALTIME_ACTION_TAG,
};
