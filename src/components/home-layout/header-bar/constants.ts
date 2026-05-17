// header bar

import { Route } from "next";
import {
  ALGORITHM_MAIN_ROUTE,
  AO_REPORT_MAIN_ROUTE,
  ARCHIVE_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  CHART_ARCHIVE_ROUTE,
  CHART_CASH_ROUTE,
  CHART_RESULT_ROUTE,
  CHART_SCHEDULE_ROUTE,
  CHART_TIPS_ROUTE,
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
} from "../../../constants/route-tag";

export const TABS_BY_ROUTE = {
  [SCHEDULE_MAIN_ROUTE]: ["bar", "cucina", "dish"],
  [CHART_SCHEDULE_ROUTE]: ["bar", "cucina", "dish"],

  [ALGORITHM_MAIN_ROUTE]: [
    "tips",
    "cash",
    "shifts",
    "vip",
    "algorithm",
    "workflow",
    "kitchen",
  ],

  [EMPLOYEES_MAIN_ROUTE]: [
    "waiters",
    "barmen",
    "cook",
    "dish",
    "mngr",
    "buyer",
  ],
  [USERS_MAIN_ROUTE]: [
    "bar",
    "cucina",
    "user",
    "mngr",
    "cash",
    "fin",
    "scr",
    "admin",
  ],

  [REPORTS_BAR_ROUTE]: ["break", "report", "tips"],

  [REPORTS_CUCINA_ROUTE]: [],

  [ORDERS_MAIN_ROUTE]: [
    "bar-ttn",
    "bar-zn",
    "cucina-ttn",
    "cucina-zn",
    "tech-ttn",
  ],

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
  [CHART_ARCHIVE_ROUTE]: ["penalty-month", "penalty-year"],

  [TIPS_MAIN_ROUTE]: ["tips-month", "tips-year"],
  [CHART_TIPS_ROUTE]: ["month", "year"],

  [CASH_MAIN_ROUTE]: ["cash-month", "cash-year"],
  [CHART_CASH_ROUTE]: ["month", "year"],

  [AO_REPORT_MAIN_ROUTE]: ["ao-month", "ao-year"],

  [TTN_MAIN_ROUTE]: ["month", "day", "year"],

  [FIN_CASH_MAIN_ROUTE]: [],

  [RESULT_MAIN_ROUTE]: ["barmen", "waiters", "cucina", "dish"],
  [CHART_RESULT_ROUTE]: ["barmen", "waiters", "cucina", "dish"],

  [SETTING_MAIN_ROUTE]: [
    "products",
    "break-list",
    "order-products",
    "ttn",
    "price-list",
  ],
} as const;

export type NAV_BY_PATCH_TYPE = Record<
  Route,
  {
    tabs: readonly string[];
    selectDate: boolean;
  }
>;

export const NAV_BY_PATCH = {
  [SCHEDULE_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[SCHEDULE_MAIN_ROUTE],
    selectDate: true,
  },

  [ALGORITHM_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[ALGORITHM_MAIN_ROUTE],
    selectDate: false,
  },

  [REPORTS_BAR_ROUTE]: {
    tabs: TABS_BY_ROUTE[REPORTS_BAR_ROUTE],
    selectDate: false,
  },

  [REPORTS_CUCINA_ROUTE]: {
    tabs: TABS_BY_ROUTE[REPORTS_CUCINA_ROUTE],
    selectDate: false,
  },

  [ARCHIVE_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[ARCHIVE_MAIN_ROUTE],
    selectDate: true,
  },

  [INFO_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[INFO_MAIN_ROUTE],
    selectDate: false,
  },

  [RESULT_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[RESULT_MAIN_ROUTE],
    selectDate: true,
  },

  [TTN_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[TTN_MAIN_ROUTE],
    selectDate: true,
  },

  [EMPLOYEES_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[EMPLOYEES_MAIN_ROUTE],
    selectDate: false,
  },

  [TIPS_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[TIPS_MAIN_ROUTE],
    selectDate: true,
  },

  [CASH_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[CASH_MAIN_ROUTE],
    selectDate: true,
  },

  [AO_REPORT_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[AO_REPORT_MAIN_ROUTE],
    selectDate: true,
  },

  [ORDERS_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[ORDERS_MAIN_ROUTE],
    selectDate: false,
  },

  [SETTING_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[SETTING_MAIN_ROUTE],
    selectDate: false,
  },

  [FIN_CASH_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[FIN_CASH_MAIN_ROUTE],
    selectDate: true,
  },

  [USERS_MAIN_ROUTE]: {
    tabs: TABS_BY_ROUTE[USERS_MAIN_ROUTE],
    selectDate: false,
  },

  [CHART_SCHEDULE_ROUTE]: {
    tabs: TABS_BY_ROUTE[CHART_SCHEDULE_ROUTE],
    selectDate: true,
  },

  [CHART_TIPS_ROUTE]: {
    tabs: TABS_BY_ROUTE[CHART_TIPS_ROUTE],
    selectDate: true,
  },

  [CHART_ARCHIVE_ROUTE]: {
    tabs: TABS_BY_ROUTE[CHART_ARCHIVE_ROUTE],
    selectDate: true,
  },

  [CHART_RESULT_ROUTE]: {
    tabs: TABS_BY_ROUTE[CHART_RESULT_ROUTE],
    selectDate: true,
  },

  [CHART_CASH_ROUTE]: {
    tabs: TABS_BY_ROUTE[CHART_CASH_ROUTE],
    selectDate: true,
  },
} satisfies Partial<NAV_BY_PATCH_TYPE>;
