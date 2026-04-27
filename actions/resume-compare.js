"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function compareResume({ resumeText, jobDescription }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert ATS system and career coach.

Resume:
${resumeText}

Job Description:
${jobDescription}

Do a detailed side-by-side comparison of the resume against the job description.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "matchScore": 72,
  "summary": "2-3 sentence overall assessment",
  "matching": [
    { "requirement": "requirement from JD", "resumeEvidence": "how resume shows this" }
  ],
  "missing": [
    { "requirement": "missing requirement", "importance": "Critical/Important/Nice-to-have", "suggestedRewrite": "suggested line to add to resume" }
  ],
  "weakSections": [
    { "section": "section name e.g. Work Experience", "issue": "what's weak", "rewrite": "improved version" }
  ],
  "keywordsToAdd": ["keyword1", "keyword2", "keyword3"],
  "verdict": "Strong Match / Good Match / Weak Match / Poor Match"
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
export async function compareResumeVsResume({ resume1Text, resume2Text }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an expert resume reviewer and career coach.

Resume 1:
${resume1Text}

Resume 2:
${resume2Text}

Compare both resumes thoroughly and identify what each is missing compared to the other, and what both are missing in general.

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "resume1Score": 72,
  "resume2Score": 85,
  "resume1Verdict": "Good Match",
  "resume2Verdict": "Strong Match",
  "winner": "Resume 2 is stronger",
  "winnerReason": "Resume 2 has better quantified achievements and more relevant keywords",
  "resume1Missing": [
    { "point": "something Resume 1 lacks that Resume 2 has", "suggestion": "how to fix it" }
  ],
  "resume2Missing": [
    { "point": "something Resume 2 lacks that Resume 1 has", "suggestion": "how to fix it" }
  ],
  "bothMissing": ["thing both resumes are missing", "another common gap"],
  "commonStrengths": ["strength both resumes share", "another common strength"]
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