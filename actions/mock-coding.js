"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { saveToHistory } from "./tech-history";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function startMockCoding({ difficulty, language, topic }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are a technical interviewer at a top tech company.

Generate a ${difficulty} level coding problem about ${topic || "general algorithms"}.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "problemTitle": "problem title",
  "difficulty": "${difficulty}",
  "topic": "${topic || "Algorithms"}",
  "problem": "complete problem statement",
  "examples": [
    { "input": "example input", "output": "expected output", "explanation": "brief explanation" }
  ],
  "constraints": ["constraint1", "constraint2"],
  "hints": ["hint1 - gentle nudge", "hint2 - bigger hint", "hint3 - almost the answer"],
  "optimalApproach": "the optimal approach name",
  "timeLimit": 30
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
  const clean = text.substring(firstBrace, lastBrace + 1);
  return JSON.parse(clean);
}

export async function evaluateSolution({ problem, solution, language, timeTaken, hintsUsed }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are a technical interviewer evaluating a coding solution.

Problem: ${problem.problem}
Optimal Approach: ${problem.optimalApproach}
Language Used: ${language}
Time Taken: ${timeTaken} minutes
Hints Used: ${hintsUsed}/3

Candidate's Solution:
${solution}

Evaluate this solution as a real interviewer would.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "overallScore": 8,
  "verdict": "Strong Hire / Hire / No Hire / Strong No Hire",
  "correctness": { "score": 9, "feedback": "feedback" },
  "efficiency": { "score": 7, "feedback": "feedback", "actualComplexity": "O(?)", "optimalComplexity": "O(?)" },
  "codeQuality": { "score": 8, "feedback": "feedback" },
  "approach": { "score": 8, "feedback": "feedback", "used": "approach used", "optimal": "${problem.optimalApproach}" },
  "timeManagement": { "score": 7, "feedback": "feedback about time taken" },
  "optimalSolution": "complete optimal solution code",
  "improvements": ["improvement1", "improvement2"],
  "interviewerNotes": "what a real interviewer would say about this candidate"
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
  const result = JSON.parse(clean);

  await saveToHistory({
    feature: "Mock Coding Interview",
    inputSummary: `${problem.difficulty} - ${problem.problemTitle} (Score: ${result.overallScore}/10)`,
    result: { problem, evaluation: result },
  });

  return result;
}