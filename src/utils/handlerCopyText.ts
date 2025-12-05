import { toast } from "sonner";

export const handleCopy = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text.toString());
  toast.success(`${text} скопирован`);
};
