"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoveRight, Lock, Mail, BrainCircuit, User, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-5 bg-[var(--background)] selection:bg-blue-500/30 overflow-hidden">
            {/* Form Section */}
            <div className="lg:col-span-2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative z-10 bg-[var(--background)]">
                <div className="w-full max-w-md space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link href="/" className="flex items-center gap-2 mb-12 group w-fit">
                            <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-xl shadow-blue-600/20">
                                <BrainCircuit size={28} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">LIKZZ</span>
                        </Link>
                        <h1 className="text-5xl font-black tracking-tighter mb-4">Join the Platinum Academy 🚀</h1>
                        <p className="text-[var(--muted-foreground)] text-lg font-medium leading-relaxed">Start your professional journey with world-class AI mentoring and expert-led labs.</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-bold flex items-start gap-3 border border-red-200 dark:border-red-800"
                            >
                                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2 block ml-1">Full Legal Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={20} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-5 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border)] focus:border-blue-500 focus:bg-[var(--card)] outline-none transition-all text-sm font-bold"
                                        placeholder="E.g. Alexander Hamilton"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2 block ml-1">Academic Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-5 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border)] focus:border-blue-500 focus:bg-[var(--card)] outline-none transition-all text-sm font-bold"
                                        placeholder="you@university.edu"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2 block ml-1">Secure Passkey</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-4 py-5 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border)] focus:border-blue-500 focus:bg-[var(--card)] outline-none transition-all text-sm font-bold"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-xs active:scale-[0.98]"
                        >
                            {isLoading ? "Synchronizing..." : "Initialize Account"}
                            {!isLoading && <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="text-center text-sm font-bold text-[var(--muted-foreground)]">
                        Already part of the network?{" "}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4">
                            Authorize Login
                        </Link>
                    </p>
                </div>
            </div>

            {/* Visual Section */}
            <div className="hidden lg:flex lg:col-span-3 relative bg-[#0f172a] overflow-hidden items-center justify-center p-20">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 blur-[180px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10 w-full max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-10"
                    >
                        <div className="space-y-4">
                            <span className="text-blue-400 font-black uppercase tracking-[0.4em] text-[10px]">Platinum Benefits</span>
                            <h2 className="text-6xl font-black text-white leading-tight tracking-tighter">Accelerate Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Future Baseline.</span></h2>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { title: "AI-First Curricula", desc: "Courses designed around modern AI integration and high-performance workflows.", color: "text-blue-400" },
                                { title: "24/7 Neural Mentor", desc: "Personalized assistance with code analysis and concept synthesis whenever you need it.", color: "text-purple-400" },
                                { title: "Industry Credentials", desc: "Gain verifiable certificates that are recognized by global technology leaders.", color: "text-emerald-400" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <CheckCircle2 size={24} className={item.color} />
                                        <h4 className="text-xl font-bold text-white">{item.title}</h4>
                                    </div>
                                    <p className="text-gray-400 font-medium leading-relaxed ml-10">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-10 flex items-center gap-8">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-[#0f172a] bg-gray-800 overflow-hidden shadow-2xl">
                                        <img src={`https://i.pravatar.cc/150?u=reg${i}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-white font-black text-lg">Join 12,400+ Students</p>
                                <p className="text-blue-400 text-xs font-black uppercase tracking-[0.1em] flex items-center gap-2">
                                    <Sparkles size={14} /> Growing by 150/day
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>
        </div>
    );
}
