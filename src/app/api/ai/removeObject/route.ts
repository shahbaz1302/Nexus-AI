import sql from "@/config/db";
import { canUsePlan, getAuthContext } from "@/lib/auth";
import connectCloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: Request) {
    try {
        const body = await request.formData();
        const image = body.get("image_file");
        const object = body.get("object");
        const { userId, plan } = await getAuthContext();

        if (!canUsePlan(plan, "premium")) {
            return NextResponse.json(
                { success: false, message: "This feature is only available for premium subscriptions." },
                { status: 403 }
            );
        }

        if (!(image instanceof File)) {
            return NextResponse.json(
                { success: false, message: "Please provide an image file." },
                { status: 400 }
            );
        }

        if (typeof object !== "string" || !object.trim()) {
            return NextResponse.json(
                { success: false, message: "Please provide an object to remove." },
                { status: 400 }
            );
        }

        await connectCloudinary();
        const imageData = await image.arrayBuffer();
        const imageDataUri = `data:${image.type || "image/png"};base64,${Buffer.from(imageData).toString("base64")}`;
        const { public_id, eager } = await cloudinary.uploader.upload(imageDataUri, {
            resource_type: "image",
            eager: [{ effect: `gen_remove:prompt_${object.trim()}` }],
        });

        const imageUrl = eager?.[0]?.secure_url ?? cloudinary.url(public_id, {
            secure: true,
            transformation: [{ effect: `gen_remove:prompt_${object.trim()}` }],
            resource_type: "image",
        });

        await sql`insert into creations (user_id,prompt,content,type)
        values (${userId}, ${`Removed ${object} from Image`}, ${imageUrl}, 'image')`;

        return NextResponse.json({
            success: true,
            content: imageUrl
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