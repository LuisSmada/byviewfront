"use client";

import { useMemo, useState } from "react";
import { TCsvData, AICommand } from "@/lib/types";
import { Card } from "../ui/card";
import { SmartCell } from "./SmartCell";
import { AIButton } from "./AIButton"; 
import {
  ArrowUpDown,
  Filter,
  X,
  Check,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

interface SmartTableProps {
  data: TCsvData;
  onBack: () => void;
}

export const SmartTable = ({ data, onBack }: SmartTableProps) => {
  const [sortCol, setSortCol] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const headers = Object.keys(data[0] || {});

  const statusColumn = headers.find((h) =>
    ["statut", "status", "état", "state"].includes(h.toLowerCase()),
  );

  const uniqueStatuses = useMemo(() => {
    if (!statusColumn) return [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const statuses = new Set(data.map((row) => row[statusColumn] as string));
    return Array.from(statuses).filter(Boolean);
  }, [data, statusColumn]);

  // Sort et filter
  const processedData = useMemo(() => {
    let result = [...data];

    if (statusColumn && filterStatus !== "all") {
      result = result.filter((row) => row[statusColumn] === filterStatus);
    }

    if (sortCol) {
      result.sort((a, b) => {
        const valA = a[sortCol]?.toString().toLowerCase() || "";
        const valB = b[sortCol]?.toString().toLowerCase() || "";

        const numA = parseFloat(valA.replace(/[^0-9.-]+/g, ""));
        const numB = parseFloat(valB.replace(/[^0-9.-]+/g, ""));

        if (!isNaN(numA) && !isNaN(numB) && valA.match(/\d/)) {
          return sortOrder === "asc" ? numA - numB : numB - numA;
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filterStatus, sortCol, sortOrder, statusColumn]);

  const handleAICommand = (cmd: AICommand) => {
    console.log("🤖 Action IA reçue:", cmd);

    if (cmd.type === "RESET") {
      setFilterStatus("all");
      setSortCol("");
      return;
    }

    if (cmd.type === "FILTER") {
      if (cmd.value) {
        setFilterStatus(cmd.value);
      }
    }

    if (cmd.type === "SORT") {
      if (cmd.column) {
        setSortCol(cmd.column);
        setSortOrder(cmd.value === "desc" ? "desc" : "asc");
      }
    }
  };

  if (!data || data.length === 0) return null;
  const isSortActive = sortCol !== "";

  return (
    <div className="min-h-screen w-full bg-ui-bg p-8 animate-in fade-in duration-500 relative">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-900">Vue d ensemble</h1>
          <p className="text-ui-textMuted">Analyse générée par BYVIEW</p>
        </div>
        <Button variant="ghost" onClick={onBack} className="text-slate-500">
          ← Retour
        </Button>
      </div>

      {/* TOOLBAR */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-end">
        {/* BOUTON RESET GLOBAL */}
        {(filterStatus !== "all" || isSortActive) && (
          <Button
            variant="ghost"
            onClick={() => {
              setFilterStatus("all");
              setSortCol("");
              setSortOrder("asc");
            }}
            className="text-ui-danger hover:bg-red-50 hover:text-red-700 h-10 px-3"
          >
            <X className="w-4 h-4 mr-2" /> Réinitialiser
          </Button>
        )}

        {/* FILTRE */}
        {statusColumn && (
          <div className="flex flex-col gap-1.5 w-full sm:w-[200px]">
            <label className="text-xs font-semibold uppercase text-ui-textMuted flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filtrer par statut
            </label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-white border-ui-borderStrong">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tout afficher</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* TRI popover */}
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-xs font-semibold uppercase text-ui-textMuted flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Trier par
          </label>

          <Popover open={isSortOpen} onOpenChange={setIsSortOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[200px] justify-between bg-white border-ui-borderStrong hover:bg-slate-50",
                  isSortActive &&
                    "border-brand-500 bg-brand-100/20 text-brand-700 ring-1 ring-brand-500 hover:bg-brand-100/30",
                )}
              >
                {isSortActive ? (
                  <span className="flex items-center gap-2 truncate">
                    {sortCol}
                    <span className="text-xs opacity-70">
                      ({sortOrder === "asc" ? "Crois." : "Décr."})
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground font-normal">
                    Sélectionner...
                  </span>
                )}
                <ArrowUpDown
                  className={cn(
                    "ml-2 h-4 w-4 shrink-0 opacity-50",
                    isSortActive && "opacity-100 text-brand-500",
                  )}
                />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[280px] p-0" align="end">
              <div className="p-4 pb-2">
                <h4 className="font-medium leading-none text-brand-900">
                  Configurer le tri
                </h4>
              </div>
              <Separator />
              <div className="p-2">
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase">
                  Colonnes
                </div>
                <div className="max-h-[200px] overflow-y-auto space-y-1">
                  {headers.map((header) => (
                    <div
                      key={header}
                      onClick={() => setSortCol(header)}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                        sortCol === header &&
                          "bg-brand-100 text-brand-900 font-medium",
                      )}
                    >
                      {header}
                      {sortCol === header && (
                        <Check className="ml-auto h-4 w-4 text-brand-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="p-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  Ordre
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setSortOrder("asc")}
                    className={cn(
                      "cursor-pointer rounded-md border p-2 flex flex-col items-center justify-center gap-1 transition-all hover:bg-slate-50",
                      sortOrder === "asc"
                        ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500"
                        : "border-input bg-white text-slate-500",
                    )}
                  >
                    <ArrowUpNarrowWide className="h-5 w-5" />
                    <span className="text-xs font-medium">Croissant</span>
                  </div>
                  <div
                    onClick={() => setSortOrder("desc")}
                    className={cn(
                      "cursor-pointer rounded-md border p-2 flex flex-col items-center justify-center gap-1 transition-all hover:bg-slate-50",
                      sortOrder === "desc"
                        ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500"
                        : "border-input bg-white text-slate-500",
                    )}
                  >
                    <ArrowDownWideNarrow className="h-5 w-5" />
                    <span className="text-xs font-medium">Décroissant</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* TABLEAU */}
      <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-xl ring-1 ring-slate-900/5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-ui-surface2">
              <TableRow className="hover:bg-transparent">
                {headers.map((header) => (
                  <TableHead
                    key={header}
                    className="font-bold text-brand-900 whitespace-nowrap px-6 py-4"
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {sortCol === header && (
                        <span className="inline-flex items-center justify-center bg-brand-100 text-brand-700 rounded-full h-5 w-5">
                          {sortOrder === "asc" ? (
                            <ArrowUpNarrowWide className="w-3 h-3" />
                          ) : (
                            <ArrowDownWideNarrow className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.length > 0 ? (
                processedData.map((row, index) => (
                  <TableRow
                    key={index}
                    className="group hover:bg-brand-50/50 transition-colors border-b border-ui-border"
                  >
                    {headers.map((header) => (
                      <TableCell
                        key={`${index}-${header}`}
                        className="whitespace-nowrap py-3 px-6"
                      >
                        <SmartCell
                          header={header}
                          value={row[header] as string}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="h-24 text-center text-ui-textMuted"
                  >
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AIButton data={data} onCommand={handleAICommand} />
    </div>
  );
};
