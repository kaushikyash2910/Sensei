"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { saveToHistory } from "./tech-history";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function explainConcept({ concept, level }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert tech educator explaining concepts at ${level} level.

Concept: "${concept}"
Explanation Level: ${level}

Explain this concept clearly.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "concept": "${concept}",
  "category": "e.g. Networking, Databases, OS, Algorithms",
  "oneLiner": "explain in one sentence",
  "explanation": "detailed explanation tailored to ${level} level",
  "analogy": "a real-world analogy to understand this better",
  "keyPoints": ["point1", "point2", "point3"],
  "example": "concrete code or real-world example",
  "commonMisconceptions": ["misconception1", "misconception2"],
  "relatedConcepts": ["concept1", "concept2", "concept3"],
  "learnNextOrder": ["what to learn after this", "then this", "then this"],
  "interviewQuestions": ["question1", "question2", "question3"]
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
      feature: "Concept Explainer",
      inputSummary: `${concept} (${level})`,
      result,
    });
    return result;
  } catch {
    throw new Error("AI response parsing failed. Please try again.");
  }
}