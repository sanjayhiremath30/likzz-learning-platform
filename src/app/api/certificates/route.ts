import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const certificates = await prisma.certificate.findMany({
            where: { userId: (session.user as any).id },
            include: { course: true }
        });
        return NextResponse.json(certificates);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
    }
}
