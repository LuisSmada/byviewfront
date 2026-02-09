import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// TYPE DEFINITIONS
type Message = {
  role: "user" | "ai";
  content: string;
};

type ChatRequestBody = {
  messages: Message[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
};

// INITIALISATION DU CLIENT
// Assure-toi que ta clé GEMINI_API_KEY est bien dans .env.local
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages, data } = body;

    // 1. Contexte réduit pour le quota gratuit (500 lignes)
    const dataPreview = data.slice(0, 500);
    const headers = Object.keys(data[0] || {}).join(", ");

    const lastUserMessage =
      messages.length > 0 ? messages[messages.length - 1].content : "Analyse.";

    // 2. Le Prompt "Contrôleur"
    // On force Gemini à répondre en JSON strict pour piloter l'UI
    const fullPrompt = `
      CONTEXTE :
      Tu es le copilote de l'application BYVIEW. Tu peux contrôler l'interface du tableau.
      Colonnes disponibles : [${headers}]
      
      DONNÉES (Extrait) :
      ${JSON.stringify(dataPreview)}

      HISTORIQUE :
      ${messages
        .slice(0, -1)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n")}

      INSTRUCTIONS STRICTES :
      Tu dois TOUJOURS répondre au format JSON pur (sans Markdown \`\`\`json).
      
      Format attendu :
      {
        "message": "Ta réponse textuelle pour l'utilisateur ici.",
        "command": {
           "type": "SORT" | "FILTER" | "RESET" | "NONE",
           "column": "Nom Exact de la colonne (si applicable)",
           "value": "Valeur du filtre ou 'asc'/'desc' pour le tri"
        }
      }

      EXEMPLES :
      - User: "Montre les impayés" -> {"message": "Voici les factures impayées.", "command": {"type": "FILTER", "column": "Statut", "value": "Impayé"}}
      - User: "Trie par montant croissant" -> {"message": "C'est trié.", "command": {"type": "SORT", "column": "Montant", "value": "asc"}}
      - User: "Annule tout" -> {"message": "Remise à zéro.", "command": {"type": "RESET"}}
      - User: "Bonjour" -> {"message": "Bonjour !", "command": {"type": "NONE"}}

      QUESTION UTILISATEUR :
      "${lastUserMessage}"
    `;

    // 3. Appel Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    let text = response.text?.toString() || "{}";

    // Nettoyage : Parfois Gemini met quand même des backticks ```json ... ```
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json({ role: "ai", content: text });
  } catch (error) {
    console.error("Erreur Backend:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
