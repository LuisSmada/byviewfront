import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({});

export const metadata: Metadata = {
  title: "BYVIEW",
  description: "Faciliter la manipulation des données",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-ui-bg`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
