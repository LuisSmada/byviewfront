import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const s = status.toLowerCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200"; 

  if (
    s.includes("payé") ||
    s.includes("paid") ||
    s.includes("valid") ||
    s.includes("success")
  ) {
    styles = "bg-emerald-100 text-emerald-700 border-emerald-200";
  } else if (
    s.includes("attente") ||
    s.includes("wait") ||
    s.includes("pending")
  ) {
    styles = "bg-amber-100 text-amber-700 border-amber-200";
  } else if (
    s.includes("impayé") ||
    s.includes("unpaid") ||
    s.includes("urgent") ||
    s.includes("error") ||
    s.includes("fail")
  ) {
    styles = "bg-rose-100 text-rose-700 border-rose-200";
  }

  console.log(s);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles,
      )}
    >
      {status}
    </span>
  );
};
