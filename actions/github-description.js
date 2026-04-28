"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateGithubDescription({ username, repos }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const repoList = repos
    .map(
      (r) =>
        `- ${r.name} (${r.language}): ${r.description || "No description"} | Stars: ${r.stars} | Topics: ${r.topics.join(", ") || "none"}`
    )
    .join("\n");

  const prompt = `
You are a professional GitHub profile writer and career coach.

GitHub Username: ${username}
Selected Repositories:
${repoList}

Write a compelling GitHub profile description for this developer that:
1. Summarizes their technical skills based on the repos
2. Highlights their most impressive projects
3. Mentions the programming languages and technologies they use
4. Sounds natural and professional — not like a robot wrote it
5. Is suitable for a recruiter-facing GitHub profile analysis

Keep it between 150-250 words. Write in first person.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "description": "the complete profile description here",
  "topSkills": ["skill1", "skill2", "skill3"],
  "profileStrength": "Strong / Good / Average"
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