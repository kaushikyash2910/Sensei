"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeSkillGap(jobDescription) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { skills: true, industry: true, experience: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
You are a career coach AI. Compare the candidate's profile to the job description below.

Candidate Profile:
- Skills: ${user.skills?.join(", ") || "None listed"}
- Industry: ${user.industry || "Not specified"}
- Experience: ${user.experience || 0} years

Job Description:
${jobDescription}

Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:
{
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "learningPlan": [
    { "skill": "skill name", "how": "short actionable advice", "timeframe": "e.g. 2 weeks" }
  ],
  "overallMatch": 72,
  "summary": "2-3 sentence summary of how well the candidate fits"
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