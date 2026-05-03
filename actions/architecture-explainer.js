"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { saveToHistory } from "./tech-history";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function explainArchitecture({ systemDescription }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert software architect.

System Description: "${systemDescription}"

Analyze this system and generate a complete architecture breakdown with an ASCII diagram.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "systemName": "inferred system name",
  "architectureType": "e.g. Microservices, Monolith, Event-Driven",
  "asciiDiagram": "ASCII art diagram showing components and connections using +--+ | and --> symbols",
  "components": [
    { "name": "component name", "type": "e.g. API Gateway, Database, Cache", "purpose": "what it does", "technology": "suggested tech" }
  ],
  "dataFlow": ["step 1 of data flow", "step 2", "step 3"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "scalabilityScore": 7,
  "suggestions": ["improvement1", "improvement2", "improvement3"],
  "markdownExport": "# Architecture: [name]\\n\\n## Overview\\n[overview text]\\n\\n## Components\\n[components as markdown table]"
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const text = response.choices[0]?.message?.content || "";
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  const clean = text.substring(firstBrace, lastBrace + 1);
  const sanitized = clean.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters
  const result = JSON.parse(sanitized);

  await saveToHistory({
    feature: "Architecture Explainer",
    inputSummary: systemDescription.substring(0, 100),
    result,
  });
  return result;
}