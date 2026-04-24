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