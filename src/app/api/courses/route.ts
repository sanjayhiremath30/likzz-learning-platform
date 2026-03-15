import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const mentor = searchParams.get("mentor");   // 👈 NEW
    const featured = searchParams.get("featured");

    try {

        const query: any = {};

        // Category filter
        if (category && category !== "All") {
            query.category = category;
        }

        // Mentor filter
        if (mentor) {
            query.instructor = {
                name: mentor.replace("-", " ")   // john-smith → john smith
            };
        }

        const courses = await prisma.course.findMany({
            where: query,
            include: {
                instructor: {
                    select: {
                        name: true
                    }
                }
            },
            take: featured ? 4 : undefined,
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(courses);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch courses" },
            { status: 500 }
        );

    }

}