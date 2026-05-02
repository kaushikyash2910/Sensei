"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getJobAnalytics() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const jobs = await db.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const total = jobs.length;
  const applied = jobs.filter((j) => j.status === "Applied").length;
  const interview = jobs.filter((j) => j.status === "Interview").length;
  const offer = jobs.filter((j) => j.status === "Offer").length;
  const rejected = jobs.filter((j) => j.status === "Rejected").length;

  const responseRate = total > 0 ? Math.round(((interview + offer + rejected) / total) * 100) : 0;
  const interviewConversion = (interview + offer + rejected) > 0
    ? Math.round((offer / (interview + offer + rejected)) * 100) : 0;
  const offerRate = total > 0 ? Math.round((offer / total) * 100) : 0;

  return {
    total, applied, interview, offer, rejected,
    responseRate, interviewConversion, offerRate,
    jobs,
  };
}

export async function getAISuggestions(analytics) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert career coach analyzing someone's job application performance.

Application Stats:
- Total Applications: ${analytics.total}
- Still Applied (no response): ${analytics.applied}
- Got Interview: ${analytics.interview}
- Got Offer: ${analytics.offer}
- Rejected: ${analytics.rejected}
- Response Rate: ${analytics.responseRate}%
- Interview to Offer Conversion: ${analytics.interviewConversion}%
- Overall Offer Rate: ${analytics.offerRate}%

Analyze these numbers and give actionable advice.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "overallAssessment": "2-3 sentence assessment of their job search performance",
  "strengths": ["strength1", "strength2"],
  "improvements": [
    { "area": "area name", "issue": "what the numbers suggest", "fix": "specific actionable advice" }
  ],
  "weeklyTarget": "recommended number of applications per week based on their data",
  "topTip": "single most impactful thing they can do right now"
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
    throw new Error("AI response parsing failed.");
  }
}