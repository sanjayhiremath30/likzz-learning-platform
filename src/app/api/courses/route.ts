import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const mentor = searchParams.get("mentor");
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
                name: mentor.replace("-", " ")
            };
        }

        const courses = await prisma.course.findMany({
            where: {
                ...query,
                OR: [
                    { isYoutubeCourse: true },
                    { isYoutubeCourse: false }
                ]
            },
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