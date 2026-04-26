"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateNegotiationScript({ offeredSalary, expectedSalary, role, company, experience, competing }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert salary negotiation coach.

Job Offer Details:
- Role: ${role}
- Company: ${company}
- Offered Salary: ${offeredSalary}
- Expected Salary: ${expectedSalary}
- Years of Experience: ${experience}
- Competing Offers: ${competing || "None"}

Generate a complete, word-for-word salary negotiation script including email, phone call script, and counter-offer strategy.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "counterOffer": "the exact salary/package to ask for",
  "emailScript": "complete word-for-word email to send",
  "phoneScript": "word-for-word phone call script with line breaks",
  "keyArguments": ["argument1", "argument2", "argument3"],
  "thingsToAvoid": ["mistake1", "mistake2", "mistake3"],
  "bestCaseOutcome": "what best case looks like",
  "walkAwayPoint": "at what point should they walk away",
  "tips": ["tip1", "tip2", "tip3"]
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