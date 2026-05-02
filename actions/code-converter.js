"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { saveToHistory } from "./tech-history";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function convertCode({ code, fromLanguage, toLanguage }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert polyglot programmer.

Convert this ${fromLanguage} code to ${toLanguage}.

Code:
${code}

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "convertedCode": "complete converted code in ${toLanguage}",
  "syntaxDifferences": [
    { "aspect": "e.g. Variable Declaration", "fromLang": "how it works in ${fromLanguage}", "toLang": "how it works in ${toLanguage}" }
  ],
  "keyChanges": ["change1", "change2", "change3"],
  "importantNotes": ["note1", "note2"],
  "equivalentLibraries": [
    { "fromLib": "library in source lang", "toLib": "equivalent in target lang", "purpose": "what it does" }
  ]
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    const clean = text.substring(firstBrace, lastBrace + 1);
    const result = JSON.parse(clean);
    await saveToHistory({
      feature: "Code Converter",
      inputSummary: `${fromLanguage} → ${toLanguage}`,
      result,
    });
    return result;
  } catch {
    throw new Error("AI response parsing failed. Please try again.");
  }
}