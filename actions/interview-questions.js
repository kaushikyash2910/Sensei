"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateInterviewQuestions({ jobDescription, experienceLevel }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert technical interviewer and career coach.

Job Description:
${jobDescription}

Experience Level: ${experienceLevel}

Generate the top 10 most likely interview questions for this role with tips on how to answer each one.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "role": "extracted role title",
  "company": "extracted company name or Unknown",
  "questions": [
    {
      "question": "question text",
      "category": "Technical / Behavioral / Situational / HR",
      "difficulty": "Easy / Medium / Hard",
      "howToAnswer": "2-3 sentence tip on how to answer this",
      "keyPoints": ["point1", "point2"],
      "modelAnswer": "a complete word-for-word model answer that would impress the interviewer"
    }
  ],
  "bonusTips": ["tip1", "tip2", "tip3"]
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