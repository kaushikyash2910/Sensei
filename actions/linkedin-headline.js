"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateHeadlines({ currentRole, targetRole, skills, experience, uniqueValue }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are a LinkedIn optimization expert and personal branding coach.

User Details:
- Current Role: ${currentRole}
- Target Role: ${targetRole}
- Top Skills: ${skills}
- Years of Experience: ${experience}
- Unique Value: ${uniqueValue}

Generate 5 highly optimized LinkedIn headlines that will attract recruiters and stand out.
Each headline should be under 220 characters, keyword-rich, and compelling.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "headlines": [
    { "headline": "headline text", "style": "style name e.g. Achievement-focused", "why": "why this works" },
    { "headline": "headline text", "style": "Keyword-rich", "why": "why this works" },
    { "headline": "headline text", "style": "Story-driven", "why": "why this works" },
    { "headline": "headline text", "style": "Value-proposition", "why": "why this works" },
    { "headline": "headline text", "style": "Bold & Direct", "why": "why this works" }
  ],
  "tips": ["tip1", "tip2", "tip3"]
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    throw new Error("AI response parsing failed. Please try again.");
  }
}