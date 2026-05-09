export const SCHEDULE_MAIN_ROUTE = "schedule";
export const ALGORITHM_MAIN_ROUTE = "algorithm";
export const EMPLOYEES_MAIN_ROUTE = "employees";
export const REPORTS_BAR_ROUTE = "report-bar";
export const REPORTS_CUCINA_ROUTE = "report-cucina";
export const ORDERS_MAIN_ROUTE = "orders";
export const INFO_MAIN_ROUTE = "info";
export const ARCHIVE_MAIN_ROUTE = "archive";
export const TIPS_MAIN_ROUTE = "tips";
export const CASH_MAIN_ROUTE = "cash";
export const AO_REPORT_MAIN_ROUTE = "a-o";
export const TTN_MAIN_ROUTE = "ttn";
export const RESULT_MAIN_ROUTE = "result";
export const SETTING_MAIN_ROUTE = "setting";
export const FIN_CASH_MAIN_ROUTE = "fin-cash";

export const PENALTY_UPDATE_MAIN_ROUTE = "penalty-update";
export const CREATE_EMPLOYEE_MAIN_ROUTE = "create-employees";
export const CREATE_USER_MAIN_ROUTE = "create-user";

export const ROUTES = [
  SCHEDULE_MAIN_ROUTE,
  ALGORITHM_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  REPORTS_BAR_ROUTE,
  REPORTS_CUCINA_ROUTE,
  ORDERS_MAIN_ROUTE,
  INFO_MAIN_ROUTE,
  ARCHIVE_MAIN_ROUTE,
  TIPS_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  AO_REPORT_MAIN_ROUTE,
  TTN_MAIN_ROUTE,
  RESULT_MAIN_ROUTE,
  SETTING_MAIN_ROUTE,
  FIN_CASH_MAIN_ROUTE,

  PENALTY_UPDATE_MAIN_ROUTE,
  CREATE_EMPLOYEE_MAIN_ROUTE,
  CREATE_USER_MAIN_ROUTE,
] as const;

export type Route = (typeof ROUTES)[number];

// footer actions bar

export const ACTION_ITEM_BY_ROUTE = {
  [SCHEDULE_MAIN_ROUTE]: ["edit", "save", "print", "mail"],
  [ALGORITHM_MAIN_ROUTE]: ["edit", "save", "print"],
  [EMPLOYEES_MAIN_ROUTE]: ["print", "create"],
  [REPORTS_BAR_ROUTE]: ["save-all", "print"],
  [REPORTS_CUCINA_ROUTE]: ["save-all"],
  [ORDERS_MAIN_ROUTE]: ["send"],
  [INFO_MAIN_ROUTE]: ["print"],
  [ARCHIVE_MAIN_ROUTE]: ["print"],
  [TIPS_MAIN_ROUTE]: ["edit", "save", "print"],
  [CASH_MAIN_ROUTE]: ["edit", "save", "print"],
  [AO_REPORT_MAIN_ROUTE]: ["edit", "save", "print"],
  [TTN_MAIN_ROUTE]: ["edit", "save", "print"],
  [FIN_CASH_MAIN_ROUTE]: ["edit", "save", "print"],
  [RESULT_MAIN_ROUTE]: ["print"],
  [SETTING_MAIN_ROUTE]: ["save-all"],

  [PENALTY_UPDATE_MAIN_ROUTE]: ["save", "print", "exit", "mail"],
  [CREATE_EMPLOYEE_MAIN_ROUTE]: ["save", "print", "exit", "reset"],
  [CREATE_USER_MAIN_ROUTE]: ["save", "print", "exit", "reset"],
} as const;

// header bar

export const TABS_BY_ROUTE = {
  [SCHEDULE_MAIN_ROUTE]: ["bar", "cucina", "dish"],

  [ALGORITHM_MAIN_ROUTE]: [
    "tips",
    "cash",
    "shifts",
    "vip",
    "algorithm",
    "workflow",
  ],

  [EMPLOYEES_MAIN_ROUTE]: ["employees", "vacation", "users"],

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
} satisfies Partial<NAV_BY_PATCH_TYPE>;
