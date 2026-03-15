import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
        const count = await prisma.course.count({
            where: { isYoutubeCourse: true }
        });

        return NextResponse.json(courses, {
            headers: {
                'X-DB-Count': count.toString(),
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error("Failed to fetch YouTube courses:", error);
        return NextResponse.json(
            { 
                error: "Failed to fetch YouTube courses",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
