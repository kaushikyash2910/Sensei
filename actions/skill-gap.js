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
// ADD these to the bottom of your existing actions/skill-gap.js

export async function analyzeSkillHeatmap(jobDescription) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { skills: true, industry: true },
  });

  const prompt = `
You are a career market analyst with access to real-time job market data.

User's Skills: ${user?.skills?.join(", ") || "Not specified"}
Industry: ${user?.industry || "Tech"}
Job Description: ${jobDescription}

Analyze each of the user's skills and rate them by market demand.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "heatmap": [
    { "skill": "React", "demand": "Hot", "trend": "Rising", "demandScore": 95, "reason": "why this rating" },
    { "skill": "jQuery", "demand": "Cold", "trend": "Declining", "demandScore": 25, "reason": "why this rating" }
  ],
  "hotSkills": ["skill1", "skill2"],
  "coldSkills": ["skill1", "skill2"],
  "topMissingHotSkills": ["skill you don't have but should", "skill2"]
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

export async function estimateLearningBudget(missingSkills) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert learning & development consultant.

Missing Skills: ${missingSkills.join(", ")}

For each missing skill, estimate the cost and time to learn it.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "skills": [
    {
      "skill": "skill name",
      "freePath": { "resource": "resource name e.g. freeCodeCamp", "timeWeeks": 4, "cost": 0 },
      "paidPath": { "resource": "resource name e.g. Udemy course", "timeWeeks": 2, "cost": 1500 },
      "difficulty": "Easy/Medium/Hard"
    }
  ],
  "totalFreeTime": "e.g. 6 months",
  "totalPaidTime": "e.g. 3 months",
  "totalFreeCost": 0,
  "totalPaidCost": 8000,
  "recommendation": "which path to recommend and why"
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

export async function autoJobMatchScore(jobDescriptions) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { skills: true, industry: true, experience: true },
  });

  const prompt = `
You are a career coach AI comparing a candidate to multiple job descriptions.

Candidate Profile:
- Skills: ${user?.skills?.join(", ") || "None listed"}
- Industry: ${user?.industry || "Not specified"}
- Experience: ${user?.experience || 0} years

Job Descriptions:
${jobDescriptions.map((jd, i) => `Job ${i + 1}:\n${jd}`).join("\n\n---\n\n")}

Rank these jobs from best to worst fit for this candidate.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "rankings": [
    {
      "rank": 1,
      "jobIndex": 0,
      "jobTitle": "extracted title",
      "company": "extracted company or Unknown",
      "matchScore": 85,
      "matchingSkills": ["skill1", "skill2"],
      "missingSkills": ["skill1"],
      "verdict": "Best fit — why",
      "applyRecommendation": "Apply now / Apply after learning X / Skip"
    }
  ],
  "summary": "overall summary of which job to prioritize and why"
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

export async function analyzeSkillTrends() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { skills: true, industry: true },
  });

  const prompt = `
You are a tech job market analyst with access to 2025 hiring trends.

User Skills: ${user?.skills?.join(", ") || "Not specified"}
Industry: ${user?.industry || "Tech"}

Analyze the market trend for each of these skills in 2025.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "skills": [
    {
      "skill": "skill name",
      "trend": "Rising/Stable/Declining",
      "trendStrength": "Strong/Moderate/Weak",
      "demandIn2025": "High/Medium/Low",
      "salaryImpact": "e.g. +15% salary premium",
      "insight": "1 sentence market insight"
    }
  ],
  "topRisingSkill": "your fastest growing skill",
  "topDecliningSkill": "your skill most at risk",
  "marketAdvice": "2-3 sentence overall career advice based on these trends"
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