"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateDSAPlan({ timeline, experience, targetCompany, language }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert DSA (Data Structures and Algorithms) interview coach.

Details:
- Timeline: ${timeline}
- Current DSA Experience: ${experience}
- Target Company Type: ${targetCompany}
- Preferred Language: ${language}

Create a complete day-by-day DSA study plan for this timeline.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "planTitle": "e.g. 30-Day DSA Mastery Plan",
  "totalDays": 30,
  "dailyHours": "2-3 hours/day",
  "weeks": [
    {
      "week": 1,
      "theme": "week theme e.g. Arrays & Strings",
      "days": [
        {
          "day": 1,
          "topic": "topic name",
          "concepts": ["concept1", "concept2"],
          "problems": [
            { "name": "problem name", "difficulty": "Easy/Medium/Hard", "platform": "LeetCode/HackerRank" }
          ],
          "revision": "what to revise from previous days"
        }
      ]
    }
  ],
  "importantTopics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "tips": ["tip1", "tip2", "tip3"]
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    throw new Error("AI response parsing failed. Please try again.");
  }
}