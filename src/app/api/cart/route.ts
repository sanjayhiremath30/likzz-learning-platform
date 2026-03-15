import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: (session.user as any).id },
            include: {
                course: {
                    include: {
                        instructor: { select: { name: true } }
                    }
                }
            }
        });
        return NextResponse.json(cartItems);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();

    try {
        const item = await prisma.cartItem.upsert({
            where: {
                userId_courseId: {
                    userId: (session.user as any).id,
                    courseId
                }
            },
            update: {},
            create: {
                userId: (session.user as any).id,
                courseId
            }
        });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    try {
        if (courseId) {
            await prisma.cartItem.delete({
                where: {
                    userId_courseId: {
                        userId: (session.user as any).id,
                        courseId
                    }
                }
            });
        } else {
            // Clear entire cart
            await prisma.cartItem.deleteMany({
                where: { userId: (session.user as any).id }
            });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
    }
}
