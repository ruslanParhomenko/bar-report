"use client";
import { ADMIN } from "@/constants/roles";
import type { Employee } from "@/features/settings/create-employee/model/type";
import EmployeeCard from "@/features/settings/view-employee/ui/employee-card";
import VacationCard from "@/features/settings/view-employee/ui/vacation-card";
import { useSession } from "next-auth/react";

export function EmployeeViewPage({ employee }: { employee: Employee }) {
  const session = useSession();
  const isAdmin = session.data?.user?.role === ADMIN;
  return (
    <div className="mt-4 grid w-full grid-cols-1 items-stretch justify-center gap-12 md:h-[88dvh] md:grid-cols-[45%_45%] md:px-2">
      <EmployeeCard employee={employee} isAdmin={isAdmin} />
      <VacationCard employee={employee} />
    </div>
  );
}
