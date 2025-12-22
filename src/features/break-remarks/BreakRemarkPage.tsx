import RemarksForm from "../remarks/RemarksForm";
import BreakForm from "../break/BreakForm";
import { SendResetButton } from "@/components/buttons/SendResetButton";

export default function BreakRemarkPage() {
  return (
    <div className="flex flex-col min-h-[90vh] gap-10">
      <BreakForm />
      <RemarksForm />
      <SendResetButton />
    </div>
  );
}
