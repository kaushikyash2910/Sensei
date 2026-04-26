"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function checkResumeScore(resumeText) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert ATS (Applicant Tracking System) and resume reviewer.

Analyze the following resume and give a detailed ATS score and feedback.

Resume:
${resumeText}

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "overallScore": 78,
  "sections": {
    "formatting": { "score": 80, "feedback": "feedback here" },
    "keywords": { "score": 75, "feedback": "feedback here" },
    "experience": { "score": 85, "feedback": "feedback here" },
    "education": { "score": 70, "feedback": "feedback here" },
    "skills": { "score": 80, "feedback": "feedback here" }
  },
  "topIssues": ["issue1", "issue2", "issue3"],
  "quickWins": ["quick fix 1", "quick fix 2", "quick fix 3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "summary": "2-3 sentence overall summary of the resume quality"
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