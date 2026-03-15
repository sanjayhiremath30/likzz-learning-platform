import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "An account with this email already exists. Please login instead." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "STUDENT",
            },
        });

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: { id: newUser.id, email: newUser.email, name: newUser.name }
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("❌ Registration error:", error);
        // Return the actual Prisma/DB error message so we can debug it
        return NextResponse.json(
            { message: error?.message || "An error occurred during registration" },
            { status: 500 }
        );
    }
}
