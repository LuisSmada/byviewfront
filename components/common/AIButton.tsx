"use client";

import { Brain, SendHorizontal, Sparkles, Bot, User } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { AICommand, AIResponse, TCsvData } from "@/lib/types";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface AIButtonProps {
  data: TCsvData;
  onCommand: (command: AICommand) => void;
}

export const AIButton = ({ data, onCommand }: AIButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Bonjour ! Je suis l'assistant BYVIEW. Je peux filtrer et trier le tableau pour vous. Dites-moi ce que vous cherchez.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = async (question: string) => {
    setIsTyping(true);
    try {
      const contextMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...contextMessages, { role: "user", content: question }],
          data: data,
        }),
      });

      if (!response.ok) throw new Error("Erreur réseau");

      const json = await response.json();

      // --- PARSING JSON STRICT ---
      try {
        // On essaie de parser la réponse comme un objet JSON structuré
        const parsedAI = JSON.parse(json.content) as AIResponse;

        // 1. Affiche le message
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: parsedAI.message },
        ]);

        // 2. Exécute la commande si elle existe
        if (parsedAI.command && parsedAI.command.type !== "NONE") {
          onCommand(parsedAI.command);
        }
      } catch (e) {
        // Si l'IA a répondu en texte brut (Markdown) sans JSON
        console.warn("Parsing JSON impossible, affichage texte brut", e);
        setMessages((prev) => [...prev, { role: "ai", content: json.content }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Désolé, je n'arrive pas à joindre le serveur.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    generateResponse(userMsg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="fixed bottom-8 right-8 z-50 animate-in zoom-in duration-300">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="h-16 w-16 cursor-pointer bg-brand-500 hover:bg-brand-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-brand-500/30 rounded-full flex justify-center items-center text-white ring-4 ring-white dark:ring-slate-900">
                  <Brain size={32} />
                  <span className="absolute top-0 right-0 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-500 animate-ping"></span>
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className="bg-brand-900 text-white border-0"
              >
                <p>Assistant BYVIEW</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SheetTrigger>

      <SheetContent
        className="flex flex-col w-full sm:max-w-[400px] p-0 border-l border-ui-border bg-ui-bg"
        side="right"
      >
        {/* HEADER */}
        <SheetHeader className="px-6 py-4 border-b border-ui-border bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
              <Sparkles size={20} />
            </div>
            <div>
              <SheetTitle className="text-brand-900">
                Assistant BYVIEW
              </SheetTitle>
              <SheetDescription className="text-xs">
                Copilote intelligent connecté à vos données.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* CHAT AREA */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex w-full gap-2",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "ai" && (
                <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0 mt-1">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                  msg.role === "user"
                    ? "bg-brand-500 text-white rounded-tr-sm"
                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm",
                )}
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: msg.content.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>",
                    ),
                  }}
                />
              </div>

              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex w-full gap-2 justify-start">
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-white border-t border-ui-border">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
            {["Trier par montant", "Filtrer impayés", "Reset"].map((sugg) => (
              <button
                key={sugg}
                onClick={() => {
                  setInput(sugg);
                }}
                className="text-xs whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 rounded-full transition-colors border border-slate-200"
              >
                {sugg}
              </button>
            ))}
          </div>

          <div className="relative flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: Trie par nom, montre les impayés..."
              className="pr-12 py-6 bg-slate-50 border-slate-200 focus-visible:ring-brand-500 rounded-xl"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className={cn(
                "absolute right-2 h-8 w-8 rounded-lg transition-all",
                input.trim()
                  ? "bg-brand-500 hover:bg-brand-600"
                  : "bg-slate-300 text-slate-500 hover:bg-slate-300",
              )}
              disabled={!input.trim() || isTyping}
            >
              <SendHorizontal size={16} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
