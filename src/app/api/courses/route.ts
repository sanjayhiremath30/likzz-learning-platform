import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");

    try {
        const where: any = {};
        if (featured === "true") where.rating = { gte: 4.5 };
        if (category) where.category = category;

        const count = await prisma.course.count();
        const courses = await prisma.course.findMany({
            where,
            include: {
                instructor: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Debug info
        const dbUrl = process.env.DATABASE_URL || "";
        const maskedUrl = dbUrl.length > 20 
            ? `${dbUrl.substring(0, 10)}...${dbUrl.substring(dbUrl.length - 10)}` 
            : "NOT_CONFIGURED";

        const responseData = {
            courses: courses.length > 0 ? courses : [],
            count: count,
            debug: {
                found: courses.length,
                total: count,
                dbStatus: dbUrl ? 'Configured' : 'Missing',
                maskedUrl,
                version: '3.0-Resilient',
                timestamp: new Date().toISOString()
            }
        };

        return NextResponse.json(responseData, {
            headers: {
                'X-API-Version': '3.0-Resilient',
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            }
        });

    } catch (error) {
        console.error("COURSES API ERROR:", error);
        
        // Return a structured error with fallback data to prevent total failure
        return NextResponse.json(
            { 
                courses: [],
                error: "Database Connectivity Issue", 
                details: error instanceof Error ? error.message : String(error),
                dbStatus: process.env.DATABASE_URL ? 'Configured' : 'Missing',
                version: '3.0-Error-Mode'
            },
            { status: 500 }
        );
    }
}