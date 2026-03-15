"use client";

import { useSession } from "next-auth/react";
import { BookOpen, Search, PlayCircle, Clock, Users, Star, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DashboardCourses() {
    const { status } = useSession();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserCourses = async () => {
            try {
                const res = await fetch("/api/user/stats");
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data.activeCourses || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (status === "authenticated") {
            fetchUserCourses();
        }
    }, [status]);

    if (status === "loading" || loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-[var(--muted-foreground)] font-medium">Loading your academy...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">My Courses 📚</h1>
                    <p className="text-[var(--muted-foreground)] font-medium">Continue your journey where you left off.</p>
                </div>
                <div className="relative group min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search your library..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] focus:border-blue-500 outline-none transition-all font-bold text-sm shadow-sm"
                    />
                </div>
            </div>

            {courses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, i) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all flex flex-col h-full"
                        >
                            <div className="h-48 w-full relative overflow-hidden">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <PlayCircle size={64} className="text-white drop-shadow-2xl" />
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                                        {course.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                                        <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                                        <span className="text-xs font-black text-blue-700 dark:text-blue-400">45% COMPLETED</span>
                                    </div>
                                </div>
                                <h3 className="font-black text-xl mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {course.title}
                                </h3>

                                <div className="mt-auto space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                            <span className="text-[var(--muted-foreground)]">Curriculum Progress</span>
                                            <span className="text-blue-600">12/32 Lessons</span>
                                        </div>
                                        <div className="h-2 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 group/btn"
                                    >
                                        RESUME SESSION <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-[var(--card)] rounded-[3rem] border-2 border-dashed border-[var(--border)]">
                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600">
                        <BookOpen size={48} />
                    </div>
                    <h2 className="text-3xl font-black mb-4 tracking-tight">Your library is currently empty</h2>
                    <p className="text-[var(--muted-foreground)] text-lg mb-10 max-w-md mx-auto font-medium">
                        You haven't enrolled in any courses yet. Start your learning journey with our platinum collection.
                    </p>
                    <Link href="/courses" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black transition-all hover:bg-blue-700 shadow-xl shadow-blue-600/30 active:scale-95 inline-block uppercase tracking-wider text-sm">
                        Discover Courses
                    </Link>
                </div>
            )}
        </div>
    );
}
