import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Groq API Key not configured" },
                { status: 500 }
            );
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are Likzz AI Mentor, a helpful AI assistant for the Likzz learning platform. Help students with coding, debugging, and understanding concepts. Be clear and encouraging."
                        },
                        ...messages
                    ],
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq Error:", data);
            return NextResponse.json(
                { error: data.error?.message || "Groq API request failed" },
                { status: response.status }
            );
        }

        return NextResponse.json({
            role: "assistant",
            content: data.choices[0].message.content
        });

    } catch (error) {
        console.error("Chat API Error:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}