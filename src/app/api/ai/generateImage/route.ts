import sql from "@/config/db";
import { canUsePlan, getAuthContext } from "@/lib/auth";
import connectCloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
        const publish = Boolean(body?.publish);
        const { userId, plan } = await getAuthContext();

        if (!canUsePlan(plan, "pro")) {
            return NextResponse.json(
                { success: false, error: "This feature is only available for pro and premium subscriptions." },
                { status: 403 }
            );
        }

        if (!prompt) {
            return NextResponse.json(
                { success: false, error: "Please provide an image prompt." },
                { status: 400 }
            );
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: { 'x-api-key': process.env.CLIPDROP_API_KEY },
            responseType: "arraybuffer"
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`

        await connectCloudinary();
        const { secure_url } = await cloudinary.uploader.upload(base64Image);

        await sql`insert into creations (user_id,prompt,content,type,publish)
        values (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

        return NextResponse.json({
            success: true,
            content: secure_url
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