import {
  AO_REPORT_MAIN_ROUTE,
  ARCHIVE_MAIN_ROUTE,
  CASH_MAIN_ROUTE,
  EMPLOYEES_MAIN_ROUTE,
  INFO_MAIN_ROUTE,
  ORDERS_MAIN_ROUTE,
  REPORTS_BAR_ROUTE,
  REPORTS_CUCINA_ROUTE,
  RESULT_MAIN_ROUTE,
  SCHEDULE_MAIN_ROUTE,
  TIPS_MAIN_ROUTE,
  TTN_MAIN_ROUTE,
} from "@/constants/endpoint-tag";
import {
  Calendar,
  BarChart3,
  List,
  Info,
  Archive,
  DollarSign,
  CreditCard,
  SigmaIcon,
  PersonStandingIcon,
  CalculatorIcon,
  FileTextIcon,
} from "lucide-react";

export const SIDEBAR_NAVIGATION = [
  {
    title: "schedule",
    url: SCHEDULE_MAIN_ROUTE,
    icon: Calendar,
  },
  {
    title: "employees",
    url: EMPLOYEES_MAIN_ROUTE,
    icon: PersonStandingIcon,
  },
  {
    title: "report-bar",
    url: REPORTS_BAR_ROUTE,
    icon: BarChart3,
  },
  {
    title: "report-cucina",
    url: REPORTS_CUCINA_ROUTE,
    icon: BarChart3,
  },

  {
    title: "orders",
    url: ORDERS_MAIN_ROUTE,
    icon: List,
  },
  {
    title: "info",
    url: INFO_MAIN_ROUTE,
    icon: Info,
  },
  {
    title: "archive",
    url: ARCHIVE_MAIN_ROUTE,
    icon: Archive,
  },

  {
    title: "tips",
    url: TIPS_MAIN_ROUTE,
    icon: DollarSign,
  },
  {
    title: "cash",
    url: CASH_MAIN_ROUTE,
    icon: CreditCard,
  },
  {
    title: "a-o",
    url: AO_REPORT_MAIN_ROUTE,
    icon: CalculatorIcon,
  },
  {
    title: "ttn",
    url: TTN_MAIN_ROUTE,
    icon: FileTextIcon,
  },
  {
    title: "result",
    url: RESULT_MAIN_ROUTE,
    icon: SigmaIcon,
  },
];
