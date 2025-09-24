"use client";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { useAbility } from "@/providers/AbilityProvider";
import InfoTable from "@/features/info/InfoTable";

const Page = () => {
  const { isObserver } = useAbility();
  return isObserver ? <InsufficientRights /> : <InfoTable />;
};

export default Page;
