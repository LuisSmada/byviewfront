"use client";

import { PrimaryButton } from "@/components/common/PrimaryButton";
import { AuroraText } from "@/components/ui/aurora-text";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="flex min-h-svh w-full flex-col items-center justify-center bg-slate-50 font-sans"
    >
      <div className="mb-5 flex items-center justify-center text-4xl font-bold">
        <span className="mr-2 text-ui-text">
          Modifier facilement vos fichiers{" "}
        </span>
        <AuroraText> Excel</AuroraText>
      </div>
      <Link href="/upload">
        <PrimaryButton>Commencer</PrimaryButton>
      </Link>
    </motion.div>
  );
}
