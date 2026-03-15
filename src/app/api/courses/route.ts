import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const mentor = searchParams.get("mentor");
    const featured = searchParams.get("featured");

    try {

        const query: any = {};

        // CATEGORY FILTER (case-insensitive)
        if (category && category !== "ALL") {
            query.category = {
                equals: category,
                mode: "insensitive"
            };
        }

        // MENTOR FILTER
        if (mentor) {
            query.instructor = {
                name: {
                    equals: mentor.replace("-", " "),
                    mode: "insensitive"
                }
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
            orderBy: {
                createdAt: "desc"
            }
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