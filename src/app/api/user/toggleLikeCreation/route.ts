import sql from "@/config/db";
import { AuthenticationError, getAuthContext } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = await getAuthContext();
        const body = await request.json();
        const id = Number(body?.id);

        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json(
                { success: false, message: "A valid creation id is required." },
                { status: 400 }
            );
        }

        const userIdStr = userId.toString();
        const [creation] = await sql`
            update creations
            set likes = case
                when ${userIdStr} = any(coalesce(likes, array[]::text[]))
                    then array_remove(coalesce(likes, array[]::text[]), ${userIdStr})
                else array_append(coalesce(likes, array[]::text[]), ${userIdStr})
            end
            where id=${id}
            returning likes
        `;

        if (!creation) {
            return NextResponse.json(
                { success: false, message: "Creation not found" },
                { status: 404 },
            );
        }

        const updatedLikes: string[] = Array.isArray(creation.likes)
            ? creation.likes
            : [];
        const isLiked = updatedLikes.includes(userIdStr);

        return NextResponse.json({
            success: true,
            message: isLiked ? "Creation liked" : "Creation unliked",
            likes: updatedLikes,
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occured";
        return NextResponse.json(
            {
                success: false, message: errorMessage,
            },
            { status: error instanceof AuthenticationError ? 401 : 500 }
        );
    }
}