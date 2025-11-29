"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import SelectEmployeeBy from "../employees/SelectEmployeeBy";

const navItems = [
  { title: "employees", patch: "employees" },
  { title: "add", patch: "employees/create" },
];

export default function TabsNavEmployees() {
  const router = useRouter();

  const t = useTranslations("Home");
  const [role, setRole] = useState("waiters");
  const [params, setParams] = useState("employees");

  console.log(params);
  useEffect(() => {
    if (!params || !role) return;
    router.push(`/${params}/?role=${role}`);
  }, [params, role]);

  return (
    <div className="md:mt-2 mt-1 md:mb-8 mb-4 sticky top-0 z-10 flex gap-1 md:gap-4">
      <Tabs
        value={params}
        onValueChange={(value) => setParams(value)}
        className="order-1 md:order-0"
      >
        <TabsList className="flex md:gap-2 h-8">
          {navItems.map((page) => (
            <TabsTrigger
              key={page.title}
              value={page.patch}
              className={cn("text-nowrap hover:text-bl cursor-pointer")}
            >
              {t(page.title)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <SelectEmployeeBy role={role} setRole={setRole} />
    </div>
  );
}
