"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateReferralRequest({
  personName, relationship, company, role,
  yourName, yourBackground, platform,
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert at writing warm, professional referral request messages that don't feel awkward.

Details:
- Person's Name: ${personName}
- Your Relationship: ${relationship}
- Company: ${company}
- Role: ${role}
- Your Name: ${yourName}
- Your Background: ${yourBackground}
- Platform: ${platform}

Write a referral request message that feels warm, genuine, and not pushy.
It should remind them who you are, explain what you're looking for, and make it easy for them to say yes or no.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "message": "the complete referral request message",
  "followUpMessage": "a short follow up if they don't reply in a week",
  "subject": "subject line if sending via email",
  "tips": ["tip1", "tip2", "tip3"],
  "doNots": ["mistake1", "mistake2"]
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