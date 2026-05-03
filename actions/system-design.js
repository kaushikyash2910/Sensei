"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { saveToHistory } from "./tech-history";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function explainSystemDesign({ topic, experienceLevel }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert system design interviewer and software architect.

Topic: "${topic}"
Candidate Experience Level: ${experienceLevel}

Give a complete, structured system design explanation suitable for a ${experienceLevel} level candidate.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "title": "e.g. Design Twitter",
  "overview": "2-3 sentence overview of the system",
  "requirements": {
    "functional": ["requirement1", "requirement2", "requirement3"],
    "nonFunctional": ["scalability requirement", "latency requirement", "availability requirement"]
  },
  "estimations": {
    "users": "e.g. 100M daily active users",
    "storage": "e.g. 100TB/day",
    "bandwidth": "e.g. 10GB/s"
  },
  "components": [
    { "name": "component name", "purpose": "what it does", "technology": "e.g. PostgreSQL, Redis, Kafka" }
  ],
  "architecture": "step-by-step description of how data flows through the system",
  "tradeoffs": [
    { "decision": "design decision", "pros": "why this approach", "cons": "what you give up" }
  ],
  "scalingStrategies": ["strategy1", "strategy2", "strategy3"],
  "interviewTips": ["tip1", "tip2", "tip3"],
  "commonMistakes": ["mistake1", "mistake2"],
  "followUpQuestions": ["question1", "question2", "question3"]
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
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    await saveToHistory({
      feature: "System Design",
      inputSummary: `${topic} (${experienceLevel})`,
      result,
    });
    return result;
  } catch {
    throw new Error("AI response parsing failed. Please try again.");
  }
}