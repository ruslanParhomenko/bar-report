import {
  Calendar,
  BarChart3, // вместо ChartBar
  Pause,
  List, // вместо ListBullets
  Settings, // вместо Gear
  Info,
  Archive,
  Ban, // вместо Prohibit
  Star,
  ThumbsUp,
  CheckCircle,
} from "lucide-react";

export const SIDEBAR_NAVIGATION = [
  {
    title: "schedule",
    url: "/schedule/bar",
    url2: "/schedule/cucina",
    icon: Calendar,
  },
  {
    title: "report",
    url: "/report/bar",
    url2: "/report/cucina",
    icon: BarChart3,
  },
  {
    title: "breakList",
    url: "/breakList",
    url2: "/breakList",
    icon: Pause,
  },
  {
    title: "ordersList",
    url: "/orders-list-ttn/ttn-bar",
    url2: "/orders-list-ttn/ttn-cucina",
    icon: List,
  },
  {
    title: "orderListBar",
    url: "/orders-list/zn-bar",
    url2: "/orders-list/zn-cucina",
    icon: List,
  },
  {
    title: "info",
    url: "/info",
    url2: "/info",
    icon: Info,
  },
  {
    title: "archive",
    url: "/archive",
    url2: "/archive",
    icon: Archive,
  },
  {
    title: "stopList",
    url: "/stop-list",
    url2: "/stop-list",
    icon: Ban,
  },
  {
    title: "meniuVip",
    url: "/meniu-vip",
    url2: "/meniu-vip",
    icon: Star,
  },
];
