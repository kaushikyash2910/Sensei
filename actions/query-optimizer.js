"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { saveToHistory } from "./tech-history";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function optimizeQuery({ query, dbType, tableInfo }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert database administrator and SQL optimizer.

Database Type: ${dbType}
Table Info: ${tableInfo || "Not provided"}
Query:
${query}

Analyze and optimize this query.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "queryAnalysis": "what this query does in plain English",
  "performanceScore": 6,
  "issues": [
    { "type": "issue type e.g. Missing Index", "severity": "High/Medium/Low", "description": "what the issue is", "impact": "performance impact" }
  ],
  "optimizedQuery": "complete optimized SQL query",
  "whatChanged": ["change1", "change2"],
  "indexSuggestions": [
    { "table": "table name", "columns": ["col1", "col2"], "reason": "why this index helps", "createStatement": "CREATE INDEX..." }
  ],
  "executionPlanBefore": "simplified description of execution plan before",
  "executionPlanAfter": "simplified description of execution plan after",
  "estimatedSpeedup": "e.g. 3-5x faster",
  "bestPractices": ["practice1", "practice2", "practice3"]
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    const clean = text.substring(firstBrace, lastBrace + 1);
    const result = JSON.parse(clean);
    await saveToHistory({
      feature: "Query Optimizer",
      inputSummary: `${dbType} query optimization`,
      result,
    });
    return result;
  } catch {
    throw new Error("AI response parsing failed. Please try again.");
  }
}