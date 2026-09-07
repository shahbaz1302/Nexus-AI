import sql from "@/config/db";
import { canUsePlan, getAuthContext } from "@/lib/auth";
import connectCloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: Request) {
    try {
        const body = await request.formData();
        const image = body.get("image_file");
        const { userId, plan } = await getAuthContext();

        if (!canUsePlan(plan, "pro")) {
            return NextResponse.json(
                { success: false, error: "This feature is only available for pro and premium subscriptions." },
                { status: 403 }
            );
        }

        if (!(image instanceof File)) {
            return NextResponse.json(
                { success: false, error: "Please provide an image file." },
                { status: 400 }
            );
        }

        if (!image.type.startsWith("image/")) {
            return NextResponse.json(
                { success: false, error: "Only image files are allowed." },
                { status: 400 }
            );
        }

        if (image.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: "Image size cannot exceed 10MB." },
                { status: 400 }
            );
        }

        await connectCloudinary();
        const imageData = await image.arrayBuffer();
        const imageDataUri = `data:${image.type || "image/png"};base64,${Buffer.from(imageData).toString("base64")}`;
        // const { secure_url } = await cloudinary.uploader.upload(imageDataUri, {
        //     transformation:[
        //         {
        //             effect:"background-removal",
        //             background_removal:"remove_the_background"
        //         }
        //     ]
        // });

        const {public_id} = await cloudinary.uploader.upload(imageDataUri,{
            resource_type:"image"
        });

        const processedUrl = cloudinary.url(public_id, {
            secure:true,
            transformation: [
                {
                    effect: "background_removal",
                },
            ],
        });

        await sql`insert into creations (user_id,prompt,content,type)
        values (${userId}, 'Remove Background from Image', ${processedUrl}, 'image')`;

        return NextResponse.json({
            success: true,
            content: processedUrl
        });
    } catch (error) {
        console.error
        const errorMessage = error instanceof Error ? error.message : "An unknown error occured";
        return NextResponse.json(
            {
                success: false, message: errorMessage,
            },
            { status: 500 }
        );
    }
}