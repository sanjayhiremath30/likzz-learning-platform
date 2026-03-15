import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {

    try {

        const courses = await prisma.course.findMany();

        return NextResponse.json(courses);

    } catch (error) {

        console.error(error);

        return NextResponse.json([]);

    }

}