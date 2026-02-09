"use client";

import { AIButton } from "@/components/common/AIButton";
import { AIDrawer } from "@/components/common/AIDrawer";
import { SmartTable } from "@/components/common/SmartTable";
import { Button } from "@/components/ui/button";
import { useCsvStore } from "@/lib/store/useCsvStore";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [openAIDrawer, setOpenAIDrawer] = useState(false);
  const { data, filename } = useCsvStore(); // On lit les données
  const router = useRouter();

  // Sécurité : Si pas de données, retour à l'accueil
  useEffect(() => {
    if (data.length === 0) {
      router.push("/");
    }
  }, [data, router]);

  if (data.length === 0) return null; // ou un loader

  return (
    <>
      <div className="ml-10 mt-10">
        <Link href="/upload" replace>
          <Button className="bg-brand-100 hover:bg-brand-700 text-brand-500 flex cursor-pointer items-center justify-center transition-all duration-500 ease-in-out hover:text-white">
            <MoveLeft />
            Revenir en arriere
          </Button>
        </Link>
      </div>
      <SmartTable data={data} onBack={() => router.push("/upload")} />
      {/* <AIButton data={data} /> */}
    </>
  );
}
