"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateCareerRoadmap({ currentRole, targetRole, currentSkills, timeframe }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert career coach and roadmap planner.

User Details:
- Current Role: ${currentRole}
- Target Role: ${targetRole}
- Current Skills: ${currentSkills}
- Desired Timeframe: ${timeframe}

Create a detailed step-by-step career roadmap to help this person transition from their current role to their target role.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "title": "roadmap title",
  "totalDuration": "estimated total time e.g. 12 months",
  "phases": [
    {
      "phase": 1,
      "title": "phase title e.g. Foundation Building",
      "duration": "e.g. Month 1-2",
      "goal": "what to achieve in this phase",
      "tasks": ["task1", "task2", "task3"],
      "resources": ["resource1", "resource2"],
      "milestone": "milestone to hit by end of this phase"
    }
  ],
  "skillsToLearn": ["skill1", "skill2", "skill3"],
  "skillsYouHave": ["skill1", "skill2"],
  "salaryExpectation": "expected salary range at target role",
  "advice": "one powerful piece of advice for this transition"
}
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
    throw new Error("AI response parsing failed. Please try again.");
  }
}