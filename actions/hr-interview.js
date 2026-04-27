"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function startInterview({ role, company, experience }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an experienced HR interviewer at ${company || "a top tech company"} interviewing a candidate for the ${role} position.

Start the interview naturally. Introduce yourself briefly and ask the first interview question.
Keep it conversational and professional. Ask only ONE question.

Experience level of candidate: ${experience}

Respond ONLY with a valid JSON object:
{
  "message": "your opening message and first question",
  "questionNumber": 1
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const text = response.choices[0]?.message?.content || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function continueInterview({ history, userAnswer, questionNumber, role, company }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const isLastQuestion = questionNumber >= 5;

  const prompt = `
You are an experienced HR interviewer at ${company || "a top tech company"} for the ${role} role.

Interview history:
${history.map((h) => `${h.role === "interviewer" ? "You" : "Candidate"}: ${h.message}`).join("\n")}

Candidate's latest answer: "${userAnswer}"

${isLastQuestion ? 
  "This was the last question. Give brief feedback on this answer, thank the candidate, and provide an overall interview assessment with score out of 10 and key strengths and areas to improve." :
  "Give very brief feedback on this answer (1 sentence), then ask the next interview question. Keep it natural and conversational."
}

Respond ONLY with a valid JSON object:
{
  "message": "your response as the interviewer",
  "feedback": "1 sentence feedback on their answer",
  "questionNumber": ${questionNumber + 1},
  "isComplete": ${isLastQuestion},
  ${isLastQuestion ? `"finalScore": 7, "strengths": ["strength1", "strength2"], "improvements": ["area1", "area2"]` : ""}
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const text = response.choices[0]?.message?.content || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}