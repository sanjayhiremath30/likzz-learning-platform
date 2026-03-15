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
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                enrollments: {
                    include: {
                        course: {
                            include: { instructor: { select: { name: true } } }
                        }
                    }
                },
                certificates: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            enrolledCourses: user.enrollments.length,
            certificates: user.certificates.length,
            hoursLearned: user.learningHours.toFixed(1),
            streak: user.streak,
            activeCourses: user.enrollments.map(e => ({
                ...e.course,
                progress: e.progress
            }))
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
