export type TCsvRow = Record<string, string | number | boolean | null>;
export type TCsvData = TCsvRow[];

export type AICommandType = "SORT" | "FILTER" | "RESET" | "NONE";

export interface AICommand {
  type: AICommandType;
  column?: string;
  value?: string;
}

export interface AIResponse {
  message: string;
  command?: AICommand;
}
