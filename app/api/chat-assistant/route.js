import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are Sensei, an expert AI career coach. You help users with career advice, interview preparation, resume tips, salary negotiation, job search strategies, and professional development. Keep answers concise, practical, and encouraging. Max 3-4 sentences per response.",
        },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    return NextResponse.json({
      message: response.choices[0]?.message?.content || "Sorry, I couldn't respond.",
    });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}