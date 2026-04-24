"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function evaluateAnswer({ question, userAnswer, industry }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert technical interviewer for the ${industry || "tech"} industry.

Interview Question: "${question}"
Candidate's Answer: "${userAnswer}"

Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:
{
  "score": 7,
  "scoreOutOf": 10,
  "verdict": "Good",
  "whatWasGood": "What the candidate did well in 1-2 sentences",
  "whatWasMissing": "What key points were missing in 1-2 sentences",
  "improvedAnswer": "A model answer that would score 10/10",
  "tips": ["tip1", "tip2", "tip3"]
}

Possible verdicts: "Excellent", "Good", "Needs Work", "Poor"
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = response.choices[0]?.message?.content || "";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    throw new Error("Evaluation failed. Try again.");
  }
}