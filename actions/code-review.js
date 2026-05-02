"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { saveToHistory } from "./tech-history";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function reviewCode({ code, language, purpose }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert code reviewer and software engineer.

Language: ${language}
Purpose: ${purpose || "General code"}
Code:
${code}

Review this code thoroughly and provide optimization suggestions.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "qualityScore": 7,
  "scoreBreakdown": {
    "readability": 8,
    "efficiency": 6,
    "bestPractices": 7,
    "security": 8,
    "maintainability": 7
  },
  "summary": "2-3 sentence overall assessment",
  "issues": [
    { "severity": "Critical/Warning/Info", "line": "line number or range", "issue": "what is wrong", "fix": "how to fix it" }
  ],
  "optimizedCode": "complete rewritten optimized version of the code",
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "whatChanged": ["change1", "change2", "change3"],
  "timeComplexityBefore": "O(?)",
  "timeComplexityAfter": "O(?)",
  "spaceComplexityBefore": "O(?)",
  "spaceComplexityAfter": "O(?)"
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
      feature: "Code Review",
      inputSummary: `${language} code review — ${purpose || "General"}`,
      result,
    });
    return result;
  } catch {
    throw new Error("AI response parsing failed. Please try again.");
  }
}