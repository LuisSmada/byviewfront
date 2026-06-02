"use client";

import { SmartTable } from "@/components/common/SmartTable";
import { useRef, useState } from "react";
import Papa from "papaparse";
import { TCsvData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MoveLeft, FileSpreadsheet, Upload, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { ShineBorder } from "@/components/ui/shine-border";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCsvStore } from "@/lib/store/useCsvStore";

export default function UploadPage() {
  const router = useRouter();
  const [view, setView] = useState<"upload" | "dashboard">("upload");
  const [parsedData, setParsedData] = useState<TCsvData>([]);

  const setCsvData = useCsvStore((state) => state.setData);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleValidate = () => {
    if (!file) return;
    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data as TCsvData);
        setCsvData(results.data as TCsvData, file.name);
        setIsLoading(false);
        router.push("/dashboard");
      },
      error: (err) => {
        setError("Erreur CSV : " + err.message);
        setIsLoading(false);
      },
    });
  };

  const validateAndSetFile = (f: File) => {
    setError(null);
    if (!f.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError("Format non supporté (CSV/Excel uniquement)");
      return;
    }
    setFile(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
    e.target.value = "";
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };


  if (view === "dashboard") {
    return (
      <SmartTable
        data={parsedData}
        onBack={() => {
          setView("upload");
          setFile(null); 
        }}
      />
    );
  }

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="flex min-h-svh w-full flex-col items-center justify-center bg-slate-50 p-4 font-sans text-brand-900"
    >
      <div className="absolute left-10 top-10">
        <Link href="/" replace>
          <Button className="bg-brand-100 hover:bg-brand-700 text-brand-500 flex cursor-pointer items-center justify-center transition-all duration-500 ease-in-out hover:text-white">
            <MoveLeft />
            Revenir en arriere
          </Button>
        </Link>
      </div>
      <Card className="relative w-full max-w-md overflow-hidden rounded-2xl border-0 bg-white shadow-2xl">
        <ShineBorder
          //   className="pointer-events-none absolute inset-0 z-0 size-full opacity-30"
          //   borderWidth={1}
          shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        />

        <div className="relative z-10 p-8">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Importez vos données
              </h2>
              <p className="text-sm text-slate-500">
                Transformez vos Excels en tableau de bord.
              </p>
              {error && (
                <p className="text-sm font-medium text-rose-500">{error}</p>
              )}
            </div>

            {/* DROPZONE */}
            <div
              className={cn(
                "group relative flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300",
                file
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200 bg-slate-50/50 hover:border-indigo-300",
              )}
              onClick={() => inputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
                accept=".csv,.xlsx"
              />

              <div className="flex flex-col items-center gap-3 text-center">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                    file
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-indigo-100 text-indigo-600",
                  )}
                >
                  {file ? (
                    <FileSpreadsheet className="h-6 w-6" />
                  ) : (
                    <Upload className="h-6 w-6" />
                  )}
                </div>
                <p className="text-sm font-medium text-slate-700">
                  {file ? file.name : "Glissez votre fichier ici"}
                </p>
                {file && (
                  <button
                    onClick={removeFile}
                    className="z-20 rounded-full bg-white p-1 text-xs text-rose-500 shadow-sm hover:text-rose-700"
                  >
                    Retirer
                  </button>
                )}
              </div>
            </div>

            {/* BOUTON D'ACTION */}
            <div className="pt-2">
              <button
                onClick={handleValidate}
                disabled={!file || isLoading}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300",
                  !file
                    ? "cursor-not-allowed bg-slate-300 opacity-50 shadow-none"
                    : "bg-indigo-600 shadow-indigo-200 hover:scale-[1.02] hover:bg-indigo-500",
                )}
              >
                {isLoading ? "Traitement..." : "Valider et Analyser"}
                {!isLoading && file && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
