"use client";

import { NAV_BY_PATCH } from "@/components/home-layout/header-bar/constants";
import { SCHEDULE_MAIN_ROUTE } from "@/constants/route-tag";
import { MONTHS } from "@/utils/get-month-days";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignInRedirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { status, data } = useSession();
  const role = data?.user?.role;

  const date = new Date();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear().toString();

  const tab = NAV_BY_PATCH[SCHEDULE_MAIN_ROUTE].tabs[0];

  const startUrl = `/${SCHEDULE_MAIN_ROUTE}?tab=${tab}&month=${month}&year=${year}`;

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (status === "authenticated") router.replace(startUrl);
  }, [status, role, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default SignInRedirect;
