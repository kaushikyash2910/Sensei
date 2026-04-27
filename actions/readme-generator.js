"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateReadme({ projectName, description, techStack, features, installation, author }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert developer who writes professional GitHub README files.

Project Details:
- Name: ${projectName}
- Description: ${description}
- Tech Stack: ${techStack}
- Key Features: ${features}
- Author: ${author || "Developer"}

Generate a complete, professional README.md file with:
- Badges for the tech stack
- Project description
- Features list
- Tech stack section
- Installation steps
- Usage guide
- Contributing section
- License section

Respond ONLY with a valid JSON object, no markdown fences outside the JSON:
{
  "readme": "the complete README.md content as a string with proper markdown",
  "badges": ["badge markdown 1", "badge markdown 2"],
  "tips": ["tip1", "tip2"]
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