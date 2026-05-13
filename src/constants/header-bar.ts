// header bar

import { Route } from "next";
import {
  ALGORITHM_MAIN_ROUTE,
  AO_REPORT_MAIN_ROUTE,
  ARCHIVE_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  FIN_CASH_MAIN_ROUTE,
  INFO_MAIN_ROUTE,
  ORDERS_MAIN_ROUTE,
  REPORTS_BAR_ROUTE,
  REPORTS_CUCINA_ROUTE,
  RESULT_MAIN_ROUTE,
  SCHEDULE_MAIN_ROUTE,
  SETTING_MAIN_ROUTE,
  TIPS_MAIN_ROUTE,
  TTN_MAIN_ROUTE,
  USERS_MAIN_ROUTE,
} from "./route-tag";

export const TABS_BY_ROUTE = {
  [SCHEDULE_MAIN_ROUTE]: ["bar", "cucina", "dish"],

  [ALGORITHM_MAIN_ROUTE]: [
    "tips",
    "cash",
    "shifts",
    "vip",
    "algorithm",
    "workflow",
    "kitchen",
  ],

  [EMPLOYEES_MAIN_ROUTE]: [],
  [USERS_MAIN_ROUTE]: [],

  [REPORTS_BAR_ROUTE]: ["break", "report", "tips"],

  [REPORTS_CUCINA_ROUTE]: [],

  [ORDERS_MAIN_ROUTE]: ["bar-ttn", "bar-zn", "cucina-ttn", "cucina-zn"],

  [INFO_MAIN_ROUTE]: [
    "stopList",
    "daily-menu",
    "statusMenu",
    "staffMenu",
    "menuVip",
    "standardKitchen",
    "price-list",
  ],

  [ARCHIVE_MAIN_ROUTE]: [
    "bar",
    "cucina",
    "breakList",
    "penalty",
    "penalty-result",
    "tips-add",
  ],

  [TIPS_MAIN_ROUTE]: ["tips-month", "tips-year"],

  [CASH_MAIN_ROUTE]: ["cash-month", "cash-year"],

  [AO_REPORT_MAIN_ROUTE]: ["ao-month", "ao-year"],

  [TTN_MAIN_ROUTE]: ["month", "day", "year"],

  [FIN_CASH_MAIN_ROUTE]: [],

  [RESULT_MAIN_ROUTE]: ["barmen", "waiters", "cucina", "dish"],

  [SETTING_MAIN_ROUTE]: [
    "products",
    "break-list",
    "order-products",
    "ttn",
    "price-list",
  ],
} as const;

const FILTERS_BY_ROUTE = {
  [EMPLOYEES_MAIN_ROUTE]: [
    "all",
    "waiters",
    "barmen",
    "cook",
    "dish",
    "mngr",
    "buyer",
  ],
  [USERS_MAIN_ROUTE]: [
    "all",
    "bar",
    "cucina",
    "user",
    "mngr",
    "cash",
    "fin",
    "scr",
    "admin",
  ],
};

export type NAV_BY_PATCH_TYPE = Record<
  Route,
  {
    tabs: readonly string[];
    selectDate: boolean;
    filters: readonly string[];
  }
>;

export const NAV_BY_PATCH = {
  [SCHEDULE_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[SCHEDULE_MAIN_ROUTE],
    selectDate: true,
    filters: [],
  },

  [ALGORITHM_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[ALGORITHM_MAIN_ROUTE],
    selectDate: false,
    filters: [],
  },

  [REPORTS_BAR_ROUTE]: {
    tabs: TABS_BY_ROUTE[REPORTS_BAR_ROUTE],
    selectDate: false,
    filters: [],
  },

  [REPORTS_CUCINA_ROUTE]: {
    tabs: TABS_BY_ROUTE[REPORTS_CUCINA_ROUTE],
    selectDate: false,
    filters: [],
  },

  [ARCHIVE_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[ARCHIVE_MAIN_ROUTE],
    selectDate: true,
    filters: [],
  },

  [INFO_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[INFO_MAIN_ROUTE],
    selectDate: false,
    filters: [],
  },

  [RESULT_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[RESULT_MAIN_ROUTE],
    selectDate: true,
    filters: [],
  },

  [TTN_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[TTN_MAIN_ROUTE],
    selectDate: true,
    filters: [],
  },

  [EMPLOYEES_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[EMPLOYEES_MAIN_ROUTE],
    selectDate: false,
    filters: FILTERS_BY_ROUTE[EMPLOYEES_MAIN_ROUTE],
  },

  [TIPS_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[TIPS_MAIN_ROUTE],
    selectDate: true,
    filters: [],
  },

  [CASH_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[CASH_MAIN_ROUTE],
    selectDate: true,
    filters: [],
  },

  [AO_REPORT_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[AO_REPORT_MAIN_ROUTE],
    selectDate: true,
    filters: [],
  },

  [ORDERS_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[ORDERS_MAIN_ROUTE],
    selectDate: false,
    filters: [],
  },

  [SETTING_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[SETTING_MAIN_ROUTE],
    selectDate: false,
    filters: [],
  },

  [FIN_CASH_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[FIN_CASH_MAIN_ROUTE],
    selectDate: true,
    filters: [],
  },

  [USERS_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[USERS_MAIN_ROUTE],
    selectDate: false,
    filters: FILTERS_BY_ROUTE[USERS_MAIN_ROUTE],
  },
} satisfies Partial<NAV_BY_PATCH_TYPE>;
