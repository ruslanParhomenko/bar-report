"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { AbilityProvider } from "@/providers/AbilityProvider";
import { CashProvider } from "@/providers/CashProvider";
import {
  EmployeesContextValue,
  EmployeesProvider,
} from "@/providers/EmployeesProvider";
import { RemarksProvider } from "@/providers/RemarksProvider";
import {
  SchedulesContextValue,
  SchedulesProvider,
} from "@/providers/ScheduleProvider";
import { TipsProvider } from "@/providers/TipsProvider";

import { getEmployees } from "./actions/employees/employeeAction";
import { getSchedule } from "./actions/schedule/scheduleAction";
import { getUsers } from "./actions/users/userAction";
import { getCashForm } from "./actions/cash/cashAction";
import { getTipsForm } from "./actions/tips/tipsAction";
import { getRemarks } from "./actions/remarks/remarksAction";

export async function DataProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const employees = await getEmployees();
  const schedules = await getSchedule();
  const users = await getUsers();
  const remarks = await getRemarks();
  const dataTips = await getTipsForm();
  const dataCash = await getCashForm();

  const email = session?.user?.email ?? null;
  const user = users.find((u) => u.mail === email);

  const ability = {
    isAdmin: email === "parhomenkogm@gmail.com" || user?.role === "ADMIN",
    isBar: user?.role === "BAR",
    isCucina: user?.role === "CUCINA",
    isUser: user?.role === "USER",
    isMngr: user?.role === "MNGR",
    isCash: user?.role === "CASH",
    isObserver: user?.role === "OBSERVER",
  };
  return (
    <AbilityProvider users={users} serverAbility={ability}>
      <EmployeesProvider employees={employees as EmployeesContextValue[]}>
        <SchedulesProvider schedules={schedules as SchedulesContextValue[]}>
          <RemarksProvider data={remarks.remarks}>
            <TipsProvider data={dataTips}>
              <CashProvider data={dataCash}>{children}</CashProvider>
            </TipsProvider>
          </RemarksProvider>
        </SchedulesProvider>
      </EmployeesProvider>
    </AbilityProvider>
  );
}
