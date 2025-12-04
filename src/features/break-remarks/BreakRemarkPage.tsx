import { SaveButton } from "@/components/buttons/SaveButton";
import { BreakForm } from "../break/BreakForm";
import { RemarksForm } from "../remarks/RemarksForm";

export default function BreakRemarkPage() {
  return (
    <div className="flex flex-col min-h-[90vh] gap-10">
      <BreakForm />
      <RemarksForm />
      <SaveButton />
    </div>
  );
}
