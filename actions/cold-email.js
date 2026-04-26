"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateColdEmail({ company, role, yourName, yourBackground, hiringManagerName }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert career coach who writes highly effective cold outreach emails to recruiters.

Details:
- Company: ${company}
- Role: ${role}
- Applicant Name: ${yourName}
- Applicant Background: ${yourBackground}
- Hiring Manager Name: ${hiringManagerName || "Hiring Manager"}

Write a cold outreach email that is concise, personalized, and compelling.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "subject": "email subject line",
  "email": "full email body here",
  "followUpEmail": "a short follow up email to send after 1 week of no reply",
  "tips": ["tip1", "tip2", "tip3"]
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
    throw new Error("AI response parsing failed. Please try again.");
  }
}