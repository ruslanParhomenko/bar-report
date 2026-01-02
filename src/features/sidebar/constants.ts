import {
  Calendar,
  BarChart3,
  Pause,
  List,
  Info,
  Archive,
  Ban,
  Settings,
  ShieldAlert,
  DollarSign,
  CreditCard,
  SigmaIcon,
  PersonStandingIcon,
  CalculatorIcon,
} from "lucide-react";

export const SIDEBAR_NAVIGATION = [
  {
    title: "schedule",
    url: "/schedule/bar",
    icon: Calendar,
  },
  {
    title: "employees",
    url: "/employees",
    icon: PersonStandingIcon,
  },
  {
    title: "reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "breakList",
    url: "/break-remarks",
    icon: Pause,
  },
  {
    title: "ordersList",
    url: "/orders-ttn",
    icon: List,
  },
  {
    title: "orderListBar",
    url: "/orders-zn",
    icon: List,
  },
  {
    title: "info",
    url: "/info",
    icon: Info,
  },
  {
    title: "archive",
    url: "/archive",
    icon: Archive,
  },
  {
    title: "stopList",
    url: "/stop-list",
    icon: Ban,
  },
  {
    title: "users",
    url: "/users",
    icon: Settings,
  },
  {
    title: "penalty",
    url: "/penalty",
    icon: ShieldAlert,
  },
  {
    title: "tips",
    url: "/tips",
    icon: DollarSign,
  },
  {
    title: "cash",
    url: "/cash",
    icon: CreditCard,
  },
  {
    title: "a-o",
    url: "/a-o",
    icon: CalculatorIcon,
  },
  {
    title: "result",
    url: "/result",
    icon: SigmaIcon,
  },
];
