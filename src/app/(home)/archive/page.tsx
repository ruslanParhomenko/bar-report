"use client";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { ArchiveForm } from "@/features/archive/ArchiveForm";
import { useAbility } from "@/providers/AbilityProvider";

const Page = () => {
  const { isAdmin, isUser, isCucina, isBar, isMngr } = useAbility();
  return isAdmin || isUser || isCucina || isBar || isMngr ? (
    <ArchiveForm />
  ) : (
    <InsufficientRights />
  );
};

export default Page;
