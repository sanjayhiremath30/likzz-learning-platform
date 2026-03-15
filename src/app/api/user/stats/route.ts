import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: { instructor: { select: { name: true } } }
                }
            }
        });

        return NextResponse.json({
            enrolledCourses: enrollments.length,
            certificates: 0,
            hoursLearned: "0.0",
            streak: 0,
            activeCourses: enrollments.map(e => ({
                ...e.course,
                thumbnail: e.course.image,
                progress: e.progress,
                instructor: e.course.instructor || { name: "Likzz Instructor" }
            }))
        });
    } catch (error) {
        console.error("Stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
