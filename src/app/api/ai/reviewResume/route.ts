import sql from "@/config/db";
import { canUsePlan, getAuthContext } from "@/lib/auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { extractText } from "unpdf";

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

        const buffer = Buffer.from(await resume.arrayBuffer());

        const { text } = await extractText(new Uint8Array(buffer));

        const resumeText = text.join("\n");

        const prompt = `
Review the following resume.

Provide ALL of these sections:

## 1. Overall Score
Give a score out of 100 and explain it.

## 2. Resume Summary
Summarize the candidate's profile.

## 3. Strengths
List the strongest aspects of the resume and explain each one.

## 4. Weaknesses
Identify weaknesses and explain how to improve them.

## 5. ATS Analysis
Evaluate ATS compatibility, keywords, formatting and readability.

## 6. Skills Analysis
Analyze the technical and soft skills.

## 7. Projects Analysis
Review the projects and suggest improvements.

## 8. Experience Analysis
Review internships/work experience and suggest improvements.

## 9. Education Analysis
Review the education section.

## 10. Formatting Analysis
Identify formatting, structure and consistency problems.

## 11. Missing Information
Identify information that should be added.

## 12. Specific Improvements
Give concrete changes the candidate should make.

## 13. Final Recommendations
Give a prioritized list of the most important changes.

IMPORTANT:
- Complete ALL 13 sections.
- Do not stop after section 1, 2 or 3.
- Do not provide a short summary instead of the complete review.
- Continue until every section has been addressed.
- Base your analysis only on the resume.

RESUME:
${resumeText}
`;

        const response = await AI.chat.completions.create({
            model: "gemini-3.7-flash",
            reasoning_effort: "low",
            messages: [
                {
                    role: "system",
                    content: `
You are an expert professional resume reviewer.

Your job is to provide a COMPLETE resume review.

You MUST provide every section requested by the user.
Never stop after only a few sections.
Do not summarize the review prematurely.
If a section has little information in the resume, explicitly say
"No sufficient information found in the resume" and continue to the next section.

Your response must be detailed, structured and useful to the candidate.
`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 6000
        });

        const content = response.choices[0]?.message?.content;

        console.log("Finish reason:", response.choices[0]?.finish_reason);
        console.log("Content length:", response.choices[0]?.message?.content?.length);
        console.log("Usage:", response.usage);

        await sql`insert into creations (user_id,prompt,content,type)
        values (${userId}, 'Reviewed the uploaded resume', ${content}, 'resume')`;

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