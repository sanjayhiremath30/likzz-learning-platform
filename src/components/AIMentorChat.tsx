"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    X,
    Bot,
    User,
    Sparkles,
    Minimize2,
    Maximize2,
    BrainCircuit,
    MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function AIMentorChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm your Likzz AI Mentor. How can I help you today? Whether it's code debug, concept explanation, or course navigation, I'm here 24/7!" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: newMessages.slice(-5) // Send last 5 messages for context
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to get AI response");
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
        } catch (err: any) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I'm having trouble connecting to my central neural processor. Please ensure the OpenAI API key is configured or try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[90vw] sm:w-[400px] h-[600px] bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl flex flex-col mb-4 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <BrainCircuit size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">LIKZZ AI Mentor</h3>
                                    <p className="text-[10px] text-blue-100 uppercase tracking-widest font-bold">Always Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <Minimize2 size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200"
                        >
                            {messages.map((m, i) => (
                                <div key={i} className={clsx("flex gap-3", m.role === "user" ? "flex-row-reverse" : "")}>
                                    <div className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        m.role === "assistant" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                    )}>
                                        {m.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
                                    </div>
                                    <div className={clsx(
                                        "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                                        m.role === "assistant"
                                            ? "bg-[var(--muted)] text-[var(--foreground)] rounded-tl-sm shadow-sm"
                                            : "bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-600/20"
                                    )}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 animate-pulse">
                                        <Bot size={18} />
                                    </div>
                                    <div className="bg-[var(--muted)] p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-blue-600/40 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-blue-600/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-blue-600/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-[var(--border)] bg-[var(--card)]">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <p className="text-[10px] text-[var(--muted-foreground)] text-center mt-3 font-medium flex items-center justify-center gap-1">
                                <Sparkles size={10} className="text-blue-500" /> Powered by LIKZZ AI Intelligence
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-4">
                {isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[var(--card)] border border-[var(--border)] px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 mb-2 cursor-pointer"
                        onClick={() => setIsMinimized(false)}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Likzz AI Mentor is here
                    </motion.div>
                )}

                <button
                    onClick={() => {
                        if (isMinimized) setIsMinimized(false);
                        else setIsOpen(!isOpen);
                    }}
                    className={clsx(
                        "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group",
                        isOpen && !isMinimized ? "bg-[var(--card)] border border-[var(--border)] !text-blue-600" : "bg-blue-600"
                    )}
                >
                    {isOpen && !isMinimized ? <X size={28} /> : (
                        <div className="relative">
                            <BrainCircuit size={28} className="group-hover:rotate-12 transition-transform" />
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                                <Sparkles size={12} className="text-blue-600" />
                            </div>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
