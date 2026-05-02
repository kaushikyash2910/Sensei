"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { saveToHistory } from "./tech-history";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function identifyPattern({ problemDescription }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert DSA coach and competitive programmer.

Problem Description: "${problemDescription}"

Identify the DSA pattern(s) that apply to this problem.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "primaryPattern": "pattern name e.g. Sliding Window",
  "confidence": 95,
  "alternativePatterns": ["pattern2", "pattern3"],
  "patternExplanation": "why this pattern fits this problem",
  "whenToUseThisPattern": ["clue1", "clue2", "clue3"],
  "approach": "step by step how to apply this pattern to the problem",
  "template": "code template for this pattern in Python",
  "similarProblems": [
    { "name": "problem name", "platform": "LeetCode", "difficulty": "Medium" }
  ],
  "allPatterns": [
    {
      "name": "Sliding Window",
      "description": "brief description",
      "useWhen": "when to identify it",
      "timeComplexity": "O(n)",
      "example": "Max sum subarray of size k"
    },
    {
      "name": "Two Pointers",
      "description": "brief description",
      "useWhen": "when to identify it",
      "timeComplexity": "O(n)",
      "example": "Two sum in sorted array"
    },
    {
      "name": "Binary Search",
      "description": "brief description",
      "useWhen": "when to identify it",
      "timeComplexity": "O(log n)",
      "example": "Search in rotated array"
    },
    {
      "name": "BFS/DFS",
      "description": "brief description",
      "useWhen": "when to identify it",
      "timeComplexity": "O(V+E)",
      "example": "Shortest path in graph"
    },
    {
      "name": "Dynamic Programming",
      "description": "brief description",
      "useWhen": "when to identify it",
      "timeComplexity": "O(n²)",
      "example": "Longest common subsequence"
    },
    {
      "name": "Backtracking",
      "description": "brief description",
      "useWhen": "when to identify it",
      "timeComplexity": "O(2^n)",
      "example": "Generate all permutations"
    }
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
      feature: "Pattern Helper",
      inputSummary: problemDescription.substring(0, 100),
      result,
    });
    return result;
  } catch {
    throw new Error("AI response parsing failed. Please try again.");
  }
}