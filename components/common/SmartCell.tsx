// src/components/dashboard/SmartCell.tsx

import { StatusBadge } from "./StatusBadge";

interface SmartCellProps {
  header: string;
  value: string;
}

export const SmartCell = ({ header, value }: SmartCellProps) => {
  const normalizeHeader = header.toLowerCase().trim();

  // 1. Détection de Statut
  if (["statut", "status", "état", "state", "etat"].includes(normalizeHeader)) {
    return <StatusBadge status={value} />;
  }

  // 2. Détection de Montant (Devise)
  if (
    value &&
    (value.toString().includes("€") || value.toString().includes("$"))
  ) {
    return (
      <span className="font-bold tabular-nums text-slate-900">{value}</span>
    );
  }

  // 3. Détection d'Email (Bonus)
  if (value && value.toString().includes("@")) {
    return (
      <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-2">
        {value}
      </span>
    );
  }

  // 4. Par défaut
  return <span className="text-slate-600">{value}</span>;
};
