"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { saveToHistory } from "./tech-history";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getNextQuestion({ level, previousQuestions, score }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are a system design interviewer.

Current Level: ${level}
Questions Asked So Far: ${previousQuestions.join(", ") || "None"}
Current Score: ${score}/10

Generate the next system design quiz question. Make it different from previous ones.
If score is high, increase difficulty. If low, keep similar level.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "question": "the system design question",
  "topic": "e.g. Scalability, Caching, Databases",
  "difficulty": "Easy/Medium/Hard",
  "keyPoints": ["what a good answer should include 1", "key point 2", "key point 3"],
  "timeLimit": 120
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
  });

  const text = response.choices[0]?.message?.content || "";
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  return JSON.parse(text.substring(firstBrace, lastBrace + 1));
}

export async function evaluateDesignAnswer({ question, answer, keyPoints }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are a system design interviewer evaluating an answer.

Question: "${question.question}"
Key Points Expected: ${keyPoints.join(", ")}
Candidate Answer: "${answer}"

Evaluate fairly.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "score": 7,
  "feedback": "detailed feedback on the answer",
  "coveredPoints": ["point they covered 1", "point 2"],
  "missedPoints": ["point they missed 1", "point 2"],
  "modelAnswer": "a perfect model answer in 3-4 sentences"
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = response.choices[0]?.message?.content || "";
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  return JSON.parse(text.substring(firstBrace, lastBrace + 1));
}

export async function saveQuizResult({ questions, scores, totalScore }) {
  await saveToHistory({
    feature: "System Design Quiz",
    inputSummary: `Quiz completed — ${totalScore}/10 avg score, ${questions.length} questions`,
    result: { questions, scores, totalScore },
  });
}