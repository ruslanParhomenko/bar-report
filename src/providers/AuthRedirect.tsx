"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const SignInRedirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { status, data } = useSession();
  const role = data?.user?.role;

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (status === "authenticated") router.replace("/schedule");
  }, [status, role, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default SignInRedirect;
