"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function recommendTechStack({ projectIdea, projectType, experience, budget, timeline }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert software architect and tech consultant.

Project Details:
- Idea: ${projectIdea}
- Type: ${projectType}
- Developer Experience Level: ${experience}
- Budget: ${budget}
- Timeline: ${timeline}

Recommend the best tech stack for this project.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "stackName": "e.g. MERN Stack / T3 Stack",
  "summary": "2-3 sentence summary of why this stack fits",
  "frontend": [
    { "name": "Next.js", "reason": "why", "learningCurve": "Easy/Medium/Hard", "jobDemand": "High/Medium/Low" }
  ],
  "backend": [
    { "name": "Node.js", "reason": "why", "learningCurve": "Easy/Medium/Hard", "jobDemand": "High/Medium/Low" }
  ],
  "database": [
    { "name": "PostgreSQL", "reason": "why", "learningCurve": "Easy/Medium/Hard", "jobDemand": "High/Medium/Low" }
  ],
  "devops": [
    { "name": "Vercel", "reason": "why", "learningCurve": "Easy/Medium/Hard", "jobDemand": "High/Medium/Low" }
  ],
  "alternatives": ["alternative stack 1", "alternative stack 2"],
  "estimatedLearningTime": "e.g. 3 months to be productive",
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"]
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