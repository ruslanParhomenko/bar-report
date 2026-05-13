// footer actions bar

import {
  ALGORITHM_MAIN_ROUTE,
  AO_REPORT_MAIN_ROUTE,
  ARCHIVE_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  CREATE_EMPLOYEE_MAIN_ROUTE,
  CREATE_USER_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  FIN_CASH_MAIN_ROUTE,
  INFO_MAIN_ROUTE,
  ORDERS_MAIN_ROUTE,
  PENALTY_UPDATE_MAIN_ROUTE,
  REPORTS_BAR_ROUTE,
  REPORTS_CUCINA_ROUTE,
  RESULT_MAIN_ROUTE,
  SCHEDULE_MAIN_ROUTE,
  SETTING_MAIN_ROUTE,
  TIPS_MAIN_ROUTE,
  TTN_MAIN_ROUTE,
  USERS_MAIN_ROUTE,
  VIEW_EMPLOYEE_MAIN_ROUTE,
} from "./route-tag";

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
  [USERS_MAIN_ROUTE]: ["print", "create"],

  [PENALTY_UPDATE_MAIN_ROUTE]: ["save", "print", "exit", "mail"],
  [CREATE_EMPLOYEE_MAIN_ROUTE]: ["save", "print", "exit", "reset"],
  [CREATE_USER_MAIN_ROUTE]: ["save", "print", "exit", "reset"],

  [VIEW_EMPLOYEE_MAIN_ROUTE]: ["print", "exit"],
} as const;
