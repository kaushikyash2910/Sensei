"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeProfile({ profileType, profileText, profileUrl }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are a professional recruiter and career coach reviewing a ${profileType} profile.

Profile URL: ${profileUrl || "Not provided"}
Profile Content:
${profileText}

Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:
{
  "overallScore": 78,
  "summary": "2-3 sentence overall impression",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": [
    { "area": "area name", "issue": "what is wrong", "fix": "exact actionable fix" }
  ],
  "keywords": {
    "present": ["keyword1", "keyword2"],
    "missing": ["keyword1", "keyword2"]
  },
  "recruiterTip": "One high-impact tip a recruiter would give"
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
// ADD these to the bottom of your existing actions/profile-analyzer.js

export async function rewriteProfile({ profileType, profileText }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert LinkedIn/GitHub profile writer and personal branding coach.

Profile Type: ${profileType}
Original Profile:
${profileText}

Rewrite this profile to be significantly more compelling, keyword-rich, and recruiter-friendly.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "rewrittenProfile": "the complete rewritten profile text",
  "improvements": ["what was changed and why 1", "change 2", "change 3"],
  "keywordsAdded": ["keyword1", "keyword2", "keyword3"],
  "scoreImprovement": "estimated score improvement e.g. +15 points"
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    throw new Error("AI response parsing failed.");
  }
}

export async function simulateRecruiterEye({ profileType, profileText }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert recruiter with 10 years of experience reviewing ${profileType} profiles.

Profile:
${profileText}

Simulate what a recruiter notices in the first 6 seconds of seeing this profile.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "firstImpression": "what hits them first in 1 sentence",
  "secondsBreakdown": [
    { "second": "0-2s", "focus": "what they look at", "reaction": "their reaction", "verdict": "Positive/Neutral/Negative" },
    { "second": "2-4s", "focus": "what they look at", "reaction": "their reaction", "verdict": "Positive/Neutral/Negative" },
    { "second": "4-6s", "focus": "what they look at", "reaction": "their reaction", "verdict": "Positive/Neutral/Negative" }
  ],
  "wouldContactYou": true,
  "wouldContactReason": "why they would or would not reach out",
  "topFixForFirstImpression": "single most impactful change for first impression",
  "overallVerdict": "Strong First Impression / Average / Weak First Impression"
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    throw new Error("AI response parsing failed.");
  }
}

export async function checkKeywordDensity({ profileType, profileText, targetRole }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert ${profileType} SEO and recruiter search optimization specialist.

Profile Type: ${profileType}
Target Role: ${targetRole || "Software Engineer"}
Profile Content:
${profileText}

Analyze how well this profile ranks for recruiter searches.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "overallSearchRank": "High/Medium/Low",
  "searchScore": 65,
  "keywords": [
    { "keyword": "keyword or phrase", "present": true, "frequency": 2, "importance": "Critical/High/Medium", "suggestion": "how to improve usage" }
  ],
  "missingCriticalKeywords": ["keyword1", "keyword2"],
  "topRecruiterSearchTerms": ["term1", "term2", "term3"],
  "titleOptimization": "advice on headline/title optimization",
  "searchTips": ["tip1", "tip2"]
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