import { SaveButton } from "@/components/buttons/SaveButton";
import { BreakForm } from "../break/BreakForm";
import { RemarksForm } from "../remarks/RemarksForm";

export function BreakRemarksPage() {
  return (
    <div className="flex flex-col min-h-[90vh] gap-20 mt-6">
      <BreakForm />
      <RemarksForm />

      <div className="mt-auto">
        <SaveButton />
      </div>
    </div>
  );
}
