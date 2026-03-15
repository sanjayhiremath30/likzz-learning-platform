import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.course.groupBy({
            by: ['category'],
            _count: {
                id: true
            }
        });

        const formatted = categories.map((cat: any) => ({
            name: cat.category || "Uncategorized",
            count: cat._count?.id || 0
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}
