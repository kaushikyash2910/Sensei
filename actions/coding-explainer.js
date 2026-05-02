"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function explainCodingChallenge({ problem, language, experienceLevel }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert competitive programmer and coding interview coach.

Problem:
${problem}

Preferred Language: ${language}
Experience Level: ${experienceLevel}

Explain this coding problem completely.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "problemTitle": "extracted or inferred problem title",
  "difficulty": "Easy/Medium/Hard",
  "category": "e.g. Arrays, Dynamic Programming, Trees",
  "understanding": "explain the problem in simple words",
  "approach": {
    "name": "approach name e.g. Two Pointer, Dynamic Programming",
    "explanation": "step by step explanation of the approach",
    "steps": ["step1", "step2", "step3", "step4"]
  },
  "solution": "complete working solution code in ${language} as a single line string with \\n for newlines",
  "complexity": {
    "time": "e.g. O(n log n)",
    "space": "e.g. O(n)",
    "explanation": "why this complexity"
  },
  "dryRun": "walk through the solution with an example input step by step",
  "edgeCases": ["edge case1", "edge case2"],
  "alternativeApproaches": [
    { "name": "approach name", "complexity": "O(?)", "whenToUse": "when this is better" }
  ],
  "similarProblems": ["problem1", "problem2", "problem3"],
  "interviewTips": ["tip1", "tip2"]
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
  // Remove markdown fences
  let clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
  
  // Find the JSON object — everything between first { and last }
  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) throw new Error("No JSON found");
  
  clean = clean.substring(firstBrace, lastBrace + 1);
  return JSON.parse(clean);
} catch {
  throw new Error("AI response parsing failed. Please try again.");
}
}