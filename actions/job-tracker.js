"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getJobs() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  return db.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createJob(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  await db.jobApplication.create({
    data: { ...data, userId: user.id },
  });

  revalidatePath("/job-tracker");
}

export async function updateJobStatus(id, status) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.jobApplication.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/job-tracker");
}

export async function deleteJob(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.jobApplication.delete({ where: { id } });
  revalidatePath("/job-tracker");
}
// ADD to bottom of actions/job-tracker.js
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateFollowUp({ company, role, applyDate, status }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const daysSince = Math.floor((new Date() - new Date(applyDate)) / (1000 * 60 * 60 * 24));

  const prompt = `
You are an expert career coach helping someone follow up on a job application.

Company: ${company}
Role: ${role}
Application Status: ${status}
Days Since Applied: ${daysSince}

Generate a follow-up strategy and message.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "shouldFollowUp": true,
  "urgency": "High/Medium/Low",
  "recommendation": "what they should do now",
  "emailSubject": "follow up email subject line",
  "emailMessage": "complete follow up email",
  "timing": "best time to send this e.g. Tuesday morning",
  "tips": ["tip1", "tip2"]
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

export async function compareOffers(offers) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert career advisor comparing multiple job offers.

Offers:
${offers.map((o, i) => `Offer ${i + 1}: ${o.company} - ${o.role} - ${o.salary || "salary not specified"} - Notes: ${o.notes || "none"}`).join("\n")}

Compare these offers comprehensively.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "winner": "company name",
  "winnerReason": "why this is the best offer",
  "comparison": [
    {
      "company": "company name",
      "role": "role",
      "salaryScore": 8,
      "growthScore": 7,
      "stabilityScore": 9,
      "cultureScore": 7,
      "overallScore": 8,
      "pros": ["pro1", "pro2"],
      "cons": ["con1"],
      "verdict": "Recommended / Consider / Pass"
    }
  ],
  "negotiationTip": "how to use competing offers to negotiate better",
  "finalAdvice": "2-3 sentence final recommendation"
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

export async function getInterviewQuestions({ company, role }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert technical interviewer for ${company}.

Role: ${role}

Generate the top 5 most likely interview questions for this specific company and role.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "questions": [
    { "question": "question text", "category": "Technical/Behavioral/HR", "tip": "how to answer this" }
  ],
  "companySpecificTip": "1 tip specific to ${company}'s interview culture"
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