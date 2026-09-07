import sql from "@/config/db";
import { canUsePlan, getAuthContext } from "@/lib/auth";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(request: Request) {
    try {
        const body = await request.formData();
        const resume = body.get("resume_file")
        const { userId, plan } = await getAuthContext();

        if (!canUsePlan(plan, "premium")) {
            return NextResponse.json(
                { success: false, message: "This feature is only available for premium subscriptions." },
                { status: 403 }
            );
        }

        if (!(resume instanceof File)) {
            return NextResponse.json(
                { success: false, message: "Please provide a resume PDF file." },
                { status: 400 }
            );
        }

        if (resume.type !== "application/pdf") {
            return NextResponse.json(
                { success: false, message: "Only PDF resume files are supported." },
                { status: 400 }
            );
        }

        if (resume.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, message: "File size exceeds the allowed size (5MB)" },
                { status: 400 }
            );
        }

        const parser = new PDFParse({
            data: Buffer.from(await resume.arrayBuffer()),
        });
        const pdfData = await parser.getText();
        await parser.destroy();

        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses and areas for improvement. Resume content:\n\n${pdfData.text}`;

        const response = await AI.chat.completions.create({
            model: "gemini-3.7-flash",
            reasoning_effort:"low",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1500
        });

        const content = response.choices[0]?.message?.content;

        await sql`insert into creations (user_id,prompt,content,type)
        values (${userId}, 'Reviewed the uploaded resume', ${content}, 'article')`;

        return NextResponse.json({
            success: true,
            content
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occured";
        return NextResponse.json(
            {
                success: false, message: errorMessage,
            },
            { status: 500 }
        );
    }
}