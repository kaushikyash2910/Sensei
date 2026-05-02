"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function researchCompany({ companyName, role }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert company researcher and career coach.

Company: ${companyName}
Role being applied for: ${role || "Software Engineer"}

Research this company thoroughly and provide a comprehensive overview for a job candidate.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "companyName": "${companyName}",
  "overview": "2-3 sentence company overview",
  "founded": "year founded",
  "headquarters": "location",
  "size": "company size e.g. 10,000+ employees",
  "industry": "industry",
  "culture": {
    "summary": "2-3 sentence culture summary",
    "values": ["value1", "value2", "value3"],
    "workLifeBalance": "Good/Average/Poor",
    "rating": 4.2
  },
  "techStack": ["tech1", "tech2", "tech3", "tech4"],
  "interviewProcess": [
    { "round": "Round 1", "type": "type e.g. Online Assessment", "description": "what to expect" }
  ],
  "salaryRange": {
    "fresher": "e.g. ₹8-12 LPA",
    "midLevel": "e.g. ₹15-25 LPA",
    "senior": "e.g. ₹30-50 LPA"
  },
  "glassdoorSentiment": {
    "score": 4.1,
    "pros": ["pro1", "pro2", "pro3"],
    "cons": ["con1", "con2"]
  },
  "recentNews": [
    { "headline": "news headline", "summary": "1 sentence summary", "sentiment": "Positive/Neutral/Negative" }
  ],
  "interviewTips": ["tip1", "tip2", "tip3"],
  "redFlags": ["red flag if any, or empty array"],
  "verdict": "Great Place / Good Place / Average / Approach with Caution"
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