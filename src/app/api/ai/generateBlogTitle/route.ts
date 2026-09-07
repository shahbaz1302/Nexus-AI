import sql from "@/config/db";
import { getAuthContext } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body?.prompt;
    const { userId, plan, freeUsage } = await getAuthContext();
    const client = await clerkClient();

    if (plan === "free" && freeUsage >= 10) {
      return NextResponse.json(
        { success: false, message: "Limit reached, upgrade to continue." },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, message: "Please provide a topic." },
        { status: 400 }
      );
    }

    const response = await AI.chat.completions.create({
      model: "gemini-3.7-flash",
      reasoning_effort:"low",
      messages: [
        {
          role: "user",
          content: prompt
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json(
        { success: false, message: "The AI did not return any blog titles. Please try again." },
        { status: 502 }
      );
    }

    await sql`insert into creations (user_id,prompt,content,type)
    values (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan === "free") {
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: freeUsage + 1
        }
      })
    }

    return NextResponse.json({
      success: true, content,
    });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occured";
    return NextResponse.json(
      {
        success: false, message: errorMessage,
      },
      { status: 500 }
    );
  }
}