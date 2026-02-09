// Pour les données CSV (au lieu de any, on dit que les valeurs sont primitives)
export type TCsvRow = Record<string, string | number | boolean | null>;
export type TCsvData = TCsvRow[];

// Pour la commande envoyée par l'IA
export type AICommandType = "SORT" | "FILTER" | "RESET" | "NONE";

export interface AICommand {
  type: AICommandType;
  column?: string;
  value?: string;
}

// Pour la réponse complète de l'IA (JSON)
export interface AIResponse {
  message: string;
  command?: AICommand;
}
