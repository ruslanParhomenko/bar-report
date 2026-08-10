"use client";

import NavTabs from "@/components/nav-tabs/nav-tabs";

import { getMonthDays, MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { getOrdersByYearMonth } from "../../orders/actions/get-orders";
import { GetOrdersData } from "../../orders/model/type";
import OrdersTable from "./orders-table";

const NAV_TABS = ["bar-zn", "cucina-zn", "bar-ttn", "cucina-ttn"];

export default function OrdersArchivePage() {
  const [activeTab, setActiveTab] = useState(NAV_TABS[0]);

  const [orders, setOrders] = useState<GetOrdersData[] | null>(null);

  const searchParams = useSearchParams();

  const month =
    MONTHS.findIndex(
      (m) => m.toLowerCase() === searchParams.get("month")?.toLowerCase(),
    ) + 1;

  const year = searchParams.get("year") ?? new Date().getFullYear().toString();

  const { monthDays } = getMonthDays({
    month: searchParams.get("month") ?? "",
    year: year,
  });

  useEffect(() => {
    async function load() {
      const data = await getOrdersByYearMonth(activeTab, year, String(month));

      startTransition(() => {
        setOrders(data);
      });
    }

    load();
  }, [activeTab]);

  if (!monthDays.length) return null;
  return (
    <div className="flex flex-col justify-center gap-2">
      <NavTabs
        navItems={NAV_TABS}
        activeTab={activeTab}
        handleTabChange={setActiveTab}
        classTrigger="text-xs h-5"
        classTabs="text-xs h-6 bg-transparent"
      />
      {orders && <OrdersTable orders={orders} monthDays={monthDays} />}
    </div>
  );
}
