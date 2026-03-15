import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json([
        { id: "test-1", title: "Test Course 1", category: "Test", price: 0 },
        { id: "test-2", title: "Test Course 2", category: "Test", price: 10 }
    ]);
}
