import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// POST /api/enroll  — enroll user in one or more courses
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { courseIds } = await request.json(); // array of course IDs

    console.log("🚀 Enrollment attempt:", { userId, courseIds });

    if (!userId) {
        return NextResponse.json({ error: "User ID missing from session" }, { status: 400 });
    }

    // Check if user actually exists in DB
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return NextResponse.json({ error: "User not found in database. Please log out and log in again." }, { status: 401 });
    }

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
        return NextResponse.json({ error: "courseIds array required" }, { status: 400 });
    }

    try {
        const enrollments = [];
        for (const courseId of courseIds) {
            console.log(`Processing enrollment for course: ${courseId}`);
            const enrollment = await prisma.enrollment.upsert({
                where: { userId_courseId: { userId, courseId } },
                update: {},  // already enrolled — no-op
                create: { userId, courseId, progress: 0 }
            });
            enrollments.push(enrollment);
        }

        // Clear the user's cart after enrollment
        await prisma.cartItem.deleteMany({ where: { userId } });
        console.log("✅ Enrollment successful, cart cleared.");

        return NextResponse.json({ success: true, enrolled: enrollments.length });
    } catch (error) {
        console.error("❌ Enroll error:", error);
        return NextResponse.json({ error: "Failed to enroll", details: String(error) }, { status: 500 });
    }
}

// GET /api/enroll — check if current user is enrolled in a course
export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
        return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } }
    });

    return NextResponse.json({ enrolled: !!enrollment });
}
