import { StatusBadge } from "./StatusBadge";

interface SmartCellProps {
  header: string;
  value: string;
}

export const SmartCell = ({ header, value }: SmartCellProps) => {
  const normalizeHeader = header.toLowerCase().trim();

  // Detection statut
  if (["statut", "status", "état", "state", "etat"].includes(normalizeHeader)) {
    return <StatusBadge status={value} />;
  }

  // Detection montant et devise
  if (
    value &&
    (value.toString().includes("€") || value.toString().includes("$"))
  ) {
    return (
      <span className="font-bold tabular-nums text-slate-900">{value}</span>
    );
  }

  // Detection email
  if (value && value.toString().includes("@")) {
    return (
      <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-2">
        {value}
      </span>
    );
  }

  return <span className="text-slate-600">{value}</span>;
};
