"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MoveRight, Lock, Mail, BrainCircuit, AlertCircle, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { status } = useSession();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    useEffect(() => {
        if (status === "authenticated") {
            router.push(callbackUrl);
        }
    }, [status, callbackUrl, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Authorization failed. Please verify your credentials.");
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected neural error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-5 bg-[var(--background)] selection:bg-blue-500/30 overflow-hidden">
            {/* Visual Side */}
            <div className="hidden lg:flex lg:col-span-3 relative bg-[#0f172a] overflow-hidden items-center justify-center p-20">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-600/20 blur-[180px] rounded-full -translate-x-1/3 -translate-y-1/3"></div>

                <div className="relative z-10 w-full max-w-2xl text-white">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <div className="space-y-4">
                            <span className="text-blue-400 font-black uppercase tracking-[0.4em] text-[10px]">Secure Access</span>
                            <h2 className="text-7xl font-black leading-[1] tracking-tighter">Synchronize With Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-black">Future Career.</span></h2>
                        </div>

                        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-2xl">
                            <p className="text-2xl font-bold leading-relaxed mb-8 text-gray-300">
                                "The seamless integration of AI research into standard curricula is exactly what the industry needed."
                            </p>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                                    <span className="font-black text-xl">TR</span>
                                </div>
                                <div>
                                    <h4 className="font-black text-xl">Thomas Reiner</h4>
                                    <p className="text-blue-400 text-xs font-black uppercase tracking-widest">VP of Engineering — TechFlow</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-12 pt-10">
                            {[
                                { label: "Uptime", val: "99.9%" },
                                { label: "Latencies", val: "<12ms" },
                                { label: "Encryption", val: "AES-256" }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <p className="text-4xl font-black text-white mb-2">{stat.val}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative bg-[var(--background)]">
                <div className="w-full max-w-md space-y-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Link href="/" className="flex items-center gap-2 mb-16 group w-fit">
                            <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-xl shadow-blue-600/30">
                                <BrainCircuit size={28} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">LIKZZ</span>
                        </Link>
                        <h1 className="text-5xl font-black tracking-tighter mb-4">Secure Login 🔓</h1>
                        <p className="text-[var(--muted-foreground)] text-lg font-medium">Initialize your learning instance to resume progress.</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs font-black flex items-start gap-3 border border-red-200 dark:border-red-800 uppercase tracking-widest"
                            >
                                <AlertCircle size={20} className="shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-2 block ml-1">Identity Token (Email)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-5 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border)] focus:border-blue-500 focus:bg-[var(--card)] outline-none transition-all text-sm font-bold"
                                        placeholder="user@network.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">System Keyphrase</label>
                                    <Link href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2">Lost Access?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
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
                            {isLoading ? "Authenticating..." : "Authorize Login"}
                            {!isLoading && <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--border)]"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                                <span className="px-4 bg-[var(--background)]">OAuth Integration</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-[var(--card)] hover:bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] font-black py-5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] active:scale-[0.98]"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sync with Google
                        </button>
                    </form>

                    <p className="text-center text-sm font-bold text-[var(--muted-foreground)]">
                        New to the Academy?{" "}
                        <Link href="/register" className="text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4">
                            Request Enrollment
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
