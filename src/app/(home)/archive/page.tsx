"use client";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { ArchiveForm } from "@/features/archive/ArchiveForm";
import { useAbility } from "@/providers/AbilityProvider";

const Page = () => {
  const { isAdmin, isUser, isCucina, isBar } = useAbility();
  return isAdmin || isUser || isCucina || isBar ? (
    <ArchiveForm />
  ) : (
    <InsufficientRights />
  );
};

export default Page;
