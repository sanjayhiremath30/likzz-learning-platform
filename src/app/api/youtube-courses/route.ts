import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            where: {
                previewVideo: { not: null },
                isYoutubeCourse: true
            },
            include: {
                instructor: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error("Failed to fetch YouTube courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch YouTube courses" },
            { status: 500 }
        );
    }
}
