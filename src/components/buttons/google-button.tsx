"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const GoogleButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <button
        className="bg-background min-w-3xs cursor-pointer rounded px-4 py-2 font-bold shadow transition-colors hover:bg-blue-300"
        onClick={() => {
          signIn("google", {
            callbackUrl: callbackUrl,
          });
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleButton;
