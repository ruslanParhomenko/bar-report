import { SaveButton } from "@/components/buttons/SaveButton";
import RemarksForm from "../remarks/RemarksForm";
import BreakForm from "../break/BreakForm";

export default function BreakRemarkPage() {
  return (
    <div className="flex flex-col min-h-[90vh] gap-10">
      <BreakForm />
      <RemarksForm />
      <SaveButton />
    </div>
  );
}
