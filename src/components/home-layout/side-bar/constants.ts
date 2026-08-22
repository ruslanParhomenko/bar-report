import { NAV_BY_PATCH } from "@/components/home-layout/header-bar/constants";
import {
  ALGORITHM_MAIN_ROUTE,
  AO_REPORT_MAIN_ROUTE,
  ARCHIVE_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  FIN_CASH_MAIN_ROUTE,
  INFO_MAIN_ROUTE,
  MENU_MAIN_ROUTE,
  ORDERS_MAIN_ROUTE,
  PARSER_1C_MAIN_ROUTE,
  REPORTS_BAR_ROUTE,
  REPORTS_CUCINA_ROUTE,
  RESULT_MAIN_ROUTE,
  SCHEDULE_MAIN_ROUTE,
  SETTING_MAIN_ROUTE,
  STOP_LIST_MAIN_ROUTE,
  TIPS_MAIN_ROUTE,
  TTN_MAIN_ROUTE,
  USERS_MAIN_ROUTE,
} from "@/constants/route-tag";
import {
  Archive,
  CalculatorIcon,
  Calendar,
  ChartCandlestick,
  ChefHat,
  ClipboardIcon,
  CodeIcon,
  CreditCard,
  DollarSign,
  FileTextIcon,
  Info,
  List,
  Martini,
  MilkOff,
  PersonStandingIcon,
  Settings,
  SigmaIcon,
  SquareMenu,
  UserRoundCog,
} from "lucide-react";

export const SIDEBAR_NAVIGATION = [
  {
    title: SCHEDULE_MAIN_ROUTE,
    icon: Calendar,
    query: NAV_BY_PATCH[SCHEDULE_MAIN_ROUTE],
  },
  {
    title: EMPLOYEES_MAIN_ROUTE,
    icon: PersonStandingIcon,
    query: NAV_BY_PATCH[EMPLOYEES_MAIN_ROUTE],
  },
  {
    title: ALGORITHM_MAIN_ROUTE,
    icon: CodeIcon,
    query: NAV_BY_PATCH[ALGORITHM_MAIN_ROUTE],
  },
  {
    title: STOP_LIST_MAIN_ROUTE,
    icon: MilkOff,
    query: NAV_BY_PATCH[STOP_LIST_MAIN_ROUTE],
  },
  {
    title: REPORTS_BAR_ROUTE,
    icon: Martini,
    query: NAV_BY_PATCH[REPORTS_BAR_ROUTE],
  },
  {
    title: REPORTS_CUCINA_ROUTE,
    icon: ChefHat,
    query: NAV_BY_PATCH[REPORTS_CUCINA_ROUTE],
  },

  {
    title: MENU_MAIN_ROUTE,
    icon: SquareMenu,
    query: NAV_BY_PATCH[MENU_MAIN_ROUTE],
  },

  {
    title: ORDERS_MAIN_ROUTE,
    icon: List,
    query: NAV_BY_PATCH[ORDERS_MAIN_ROUTE],
  },
  {
    title: INFO_MAIN_ROUTE,
    icon: Info,
    query: NAV_BY_PATCH[INFO_MAIN_ROUTE],
  },
  {
    title: ARCHIVE_MAIN_ROUTE,
    icon: Archive,
    query: NAV_BY_PATCH[ARCHIVE_MAIN_ROUTE],
  },

  {
    title: TIPS_MAIN_ROUTE,
    icon: DollarSign,
    query: NAV_BY_PATCH[TIPS_MAIN_ROUTE],
  },
  {
    title: CASH_MAIN_ROUTE,
    icon: CreditCard,
    query: NAV_BY_PATCH[CASH_MAIN_ROUTE],
  },
  {
    title: AO_REPORT_MAIN_ROUTE,
    icon: CalculatorIcon,
    query: NAV_BY_PATCH[AO_REPORT_MAIN_ROUTE],
  },
  {
    title: TTN_MAIN_ROUTE,
    icon: FileTextIcon,
    query: NAV_BY_PATCH[TTN_MAIN_ROUTE],
  },
  {
    title: FIN_CASH_MAIN_ROUTE,
    icon: ClipboardIcon,
    query: NAV_BY_PATCH[FIN_CASH_MAIN_ROUTE],
  },
  {
    title: RESULT_MAIN_ROUTE,
    icon: SigmaIcon,
    query: NAV_BY_PATCH[RESULT_MAIN_ROUTE],
  },
  {
    title: SETTING_MAIN_ROUTE,
    icon: Settings,
    query: NAV_BY_PATCH[SETTING_MAIN_ROUTE],
  },
  {
    title: USERS_MAIN_ROUTE,
    icon: UserRoundCog,
    query: NAV_BY_PATCH[USERS_MAIN_ROUTE],
  },
  {
    title: PARSER_1C_MAIN_ROUTE,
    icon: ChartCandlestick,
    query: NAV_BY_PATCH[PARSER_1C_MAIN_ROUTE],
  },
];
