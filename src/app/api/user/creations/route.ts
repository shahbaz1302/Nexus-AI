import sql from "@/config/db";
import { AuthenticationError, getAuthContext } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { userId } = await getAuthContext();

        const creations = await sql`select * from creations where user_id=${userId} order by created_at desc`;

        return NextResponse.json({
            success: true,
            creations
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