import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "INSTRUCTOR") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const courses = await prisma.course.findMany({
            where: { instructorId: (session.user as any).id },
            include: {
                students: true,
            }
        });

        const totalStudents = courses.reduce((acc, c) => acc + c.students.length, 0);
        const totalRevenue = courses.reduce((acc, c) => acc + (c.students.length * c.price), 0);
        const activeCourses = courses.filter(c => c.students.length > 0).length;
        const avgRating = courses.reduce((acc, c: any) => acc + (c.rating || 0), 0) / (courses.length || 1);

        return NextResponse.json({
            stats: {
                totalStudents: totalStudents.toLocaleString(),
                totalRevenue: `$${totalRevenue.toLocaleString()}`,
                activeCourses: courses.length,
                avgRating: avgRating.toFixed(1)
            },
            courses: courses.map(c => ({
                id: c.id,
                title: c.title,
                students: c.students.length,
                revenue: `$${(c.students.length * c.price).toLocaleString()}`,
                status: "Published" // Simple mockup for now
            }))
        });
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch instructor data" }, { status: 500 });
    }
}
