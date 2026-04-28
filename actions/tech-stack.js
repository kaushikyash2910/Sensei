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
  "stackName": "e.g. MERN Stack",
  "summary": "2-3 sentence summary of why this stack fits",
  "frontend": [
    { "name": "Next.js", "reason": "why", "learningCurve": "Easy/Medium/Hard", "jobDemand": "High/Medium/Low", "demandScore": 85 }
  ],
  "backend": [
    { "name": "Node.js", "reason": "why", "learningCurve": "Easy/Medium/Hard", "jobDemand": "High/Medium/Low", "demandScore": 80 }
  ],
  "database": [
    { "name": "PostgreSQL", "reason": "why", "learningCurve": "Easy/Medium/Hard", "jobDemand": "High/Medium/Low", "demandScore": 75 }
  ],
  "devops": [
    { "name": "Vercel", "reason": "why", "learningCurve": "Easy/Medium/Hard", "jobDemand": "High/Medium/Low", "demandScore": 70 }
  ],
  "alternatives": ["alternative stack 1", "alternative stack 2"],
  "estimatedLearningTime": "e.g. 3 months to be productive",
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"],
  "learningPath": [
    { "week": "Week 1-2", "focus": "topic to learn", "resources": ["resource1", "resource2"] },
    { "week": "Week 3-4", "focus": "topic to learn", "resources": ["resource1"] },
    { "week": "Week 5-6", "focus": "topic to learn", "resources": ["resource1"] },
    { "week": "Week 7-8", "focus": "topic to learn", "resources": ["resource1"] }
  ],
  "similarProjects": [
    { "name": "Project/App Name", "description": "what it is", "techUsed": ["tech1", "tech2"] }
  ]
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

export async function compareTwoStacks({ stack1, stack2, projectIdea }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert software architect.

Compare these two tech stacks for the following project:
Project: ${projectIdea}
Stack 1: ${stack1}
Stack 2: ${stack2}

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "winner": "Stack 1 or Stack 2 name",
  "winnerReason": "why it wins for this project",
  "stack1": {
    "name": "${stack1}",
    "score": 78,
    "pros": ["pro1", "pro2"],
    "cons": ["con1", "con2"],
    "bestFor": "what this stack is best for",
    "learningCurve": "Easy/Medium/Hard",
    "jobDemand": "High/Medium/Low"
  },
  "stack2": {
    "name": "${stack2}",
    "score": 85,
    "pros": ["pro1", "pro2"],
    "cons": ["con1", "con2"],
    "bestFor": "what this stack is best for",
    "learningCurve": "Easy/Medium/Hard",
    "jobDemand": "High/Medium/Low"
  },
  "verdict": "2-3 sentence final verdict"
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