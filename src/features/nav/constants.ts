import { BarChart2, LineChart, List, Pause } from "lucide-react";

export const SIDEBAR_NAVIGATION = [
  {
    title: "schedule",
    url: "/schedule/bar",
    url2: "/schedule/cucina",
    icon: LineChart,
  },
  {
    title: "report",
    url: "/report/bar",
    url2: "report/cucina",
    icon: BarChart2,
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
    title: "settings",
    url: "/settings",
    url2: "/settings",
    icon: List,
  },
  {
    title: "arhive",
    url: "/arhive",
    url2: "/arhive",
    icon: List,
  },
  {
    title: "stopList",
    url: "/stop-list",
    url2: "/stop-list-cucina",
    icon: List,
  },
  {
    title: "employeeRemarks",
    url: "/employee-remarks",
    url2: "/employee-remarks",
    icon: List,
  },
];
