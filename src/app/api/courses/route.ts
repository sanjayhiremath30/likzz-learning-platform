import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {

    try {

        const courses = await prisma.course.findMany({
            include: {
                instructor: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(courses);

    } catch (error) {

        console.error("COURSES API ERROR:", error);

        return NextResponse.json([]);

    }

}