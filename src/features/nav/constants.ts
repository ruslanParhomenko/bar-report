import {
  Calendar,
  ChartBar,
  Pause,
  ListBullets,
  Gear,
  Info,
  Archive,
  Prohibit,
  Star,
  ThumbsUp,
  CheckCircle,
} from "phosphor-react";

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
    icon: ChartBar, // отчёты/статистика
  },
  {
    title: "breakList",
    url: "/breakList",
    url2: "/breakList",
    icon: Pause, // паузы/брейки
  },
  {
    title: "ordersList",
    url: "/orders-list-ttn/ttn-bar",
    url2: "/orders-list-ttn/ttn-cucina",
    icon: ListBullets, // список заказов
  },
  {
    title: "orderListBar",
    url: "/orders-list/zn-bar",
    url2: "/orders-list/zn-cucina",
    icon: ListBullets,
  },
  {
    title: "settings",
    url: "/settings",
    url2: "/settings",
    icon: Gear, // ⚙️ настройки
  },
  {
    title: "info",
    url: "/info/employee",
    url2: "/info/employee",
    icon: Info, // ℹ️ инфо
  },
  {
    title: "archive",
    url: "/archive",
    url2: "/archive",
    icon: Archive, // 🗂 архив
  },
  {
    title: "stopList",
    url: "/stop-list",
    url2: "/stop-list",
    icon: Prohibit, // ⛔ стоп-лист
  },
  {
    title: "meniuVip",
    url: "/meniu-vip",
    url2: "/meniu-vip",
    icon: Star, // ⭐️ VIP меню
  },
  {
    title: "meniuRating",
    url: "/meniu-staff",
    url2: "/meniu-staff",
    icon: ThumbsUp, // 👍 рейтинг
  },
];
