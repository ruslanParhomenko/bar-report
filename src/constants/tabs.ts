import { TABS_BY_ROUTE } from "@/components/home-layout/header-bar/constants";

export const TABS_KEY_ROUTE = Object.entries(TABS_BY_ROUTE).flatMap(
  ([route, tabs]) => tabs.map((tab) => `${route}_${tab}`),
);
